import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

interface MemoryCacheEntry {
  value: string;
  expiresAt: number | null;
}

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private redisClient: Redis | null = null;
  private isRedisAvailable = false;
  private readonly memoryCache = new Map<string, MemoryCacheEntry>();

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.config.get<string>('database.redisUrl') || process.env.REDIS_URL;
    if (redisUrl) {
      try {
        this.redisClient = new Redis(redisUrl, {
          maxRetriesPerRequest: 1,
          connectTimeout: 2500,
          enableOfflineQueue: false,
          retryStrategy: (times) => {
            if (times > 3) {
              this.logger.warn('Redis reconnection stopped after 3 attempts. Falling back to memory cache.');
              return null; // Stop reconnecting
            }
            return Math.min(times * 1000, 3000);
          },
        });

        this.redisClient.on('connect', () => {
          this.isRedisAvailable = true;
          this.logger.log('Redis connected successfully for distributed caching and rate limiting.');
        });

        this.redisClient.on('error', (err) => {
          this.isRedisAvailable = false;
          this.logger.warn(`Redis connection error (${err.message}). Using in-memory fallback.`);
        });
      } catch (err: any) {
        this.isRedisAvailable = false;
        this.logger.warn(`Failed to initialize Redis client (${err?.message}). Running in in-memory mode.`);
      }
    } else {
      this.logger.log('No REDIS_URL configured. Cache running in in-memory mode.');
    }
  }

  async onModuleDestroy() {
    if (this.redisClient) {
      try {
        await this.redisClient.quit();
      } catch {
        this.redisClient.disconnect();
      }
    }
  }

  get isConnected(): boolean {
    return this.isRedisAvailable && this.redisClient?.status === 'ready';
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.isConnected && this.redisClient) {
      try {
        const raw = await this.redisClient.get(key);
        return raw ? (JSON.parse(raw) as T) : null;
      } catch (err: any) {
        this.logger.warn(`Redis get error for key "${key}": ${err?.message}. Checking memory fallback.`);
      }
    }

    const entry = this.memoryCache.get(key);
    if (!entry) return null;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }

    try {
      return JSON.parse(entry.value) as T;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
    const serialized = JSON.stringify(value);

    if (this.isConnected && this.redisClient) {
      try {
        if (ttlSeconds > 0) {
          await this.redisClient.set(key, serialized, 'EX', ttlSeconds);
        } else {
          await this.redisClient.set(key, serialized);
        }
        return;
      } catch (err: any) {
        this.logger.warn(`Redis set error for key "${key}": ${err?.message}. Saving to memory fallback.`);
      }
    }

    // In-memory fallback
    const expiresAt = ttlSeconds !== undefined && ttlSeconds !== null ? Date.now() + ttlSeconds * 1000 : null;
    this.memoryCache.set(key, { value: serialized, expiresAt });

    // Clean old keys if map exceeds 500 entries
    if (this.memoryCache.size > 500) {
      const now = Date.now();
      for (const [k, v] of this.memoryCache.entries()) {
        if (v.expiresAt && now > v.expiresAt) {
          this.memoryCache.delete(k);
        }
      }
    }
  }

  async del(key: string): Promise<void> {
    if (this.isConnected && this.redisClient) {
      try {
        await this.redisClient.del(key);
      } catch (err: any) {
        this.logger.warn(`Redis del error for key "${key}": ${err?.message}`);
      }
    }
    this.memoryCache.delete(key);
  }

  async reset(): Promise<void> {
    if (this.isConnected && this.redisClient) {
      try {
        await this.redisClient.flushdb();
      } catch (err: any) {
        this.logger.warn(`Redis flushdb error: ${err?.message}`);
      }
    }
    this.memoryCache.clear();
  }

  async delByPrefix(prefix: string): Promise<void> {
    if (this.isConnected && this.redisClient) {
      try {
        const keys = await this.redisClient.keys(`${prefix}*`);
        if (keys.length > 0) {
          await this.redisClient.del(...keys);
        }
      } catch (err: any) {
        this.logger.warn(`Redis delByPrefix error for "${prefix}": ${err?.message}`);
      }
    }

    for (const k of this.memoryCache.keys()) {
      if (k.startsWith(prefix)) {
        this.memoryCache.delete(k);
      }
    }
  }

  /**
   * Helper method to wrap expensive query computations with cache
   */
  async wrap<T>(key: string, fetcher: () => Promise<T>, ttlSeconds = 300): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }
    const fresh = await fetcher();
    await this.set(key, fresh, ttlSeconds);
    return fresh;
  }
}

