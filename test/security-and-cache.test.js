const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { cookieParserMiddleware } = require('../dist/src/common/middleware/cookie-parser.middleware');
const { CacheService } = require('../dist/src/common/cache/cache.service');

describe('Security & Cookie Parser Middleware', () => {
  it('should initialize req.cookies to empty object when no cookie header exists', () => {
    const req = { headers: {} };
    let nextCalled = false;
    cookieParserMiddleware(req, {}, () => { nextCalled = true; });
    assert.strictEqual(nextCalled, true);
    assert.deepStrictEqual(req.cookies, {});
  });

  it('should parse simple key-value cookies', () => {
    const req = { headers: { cookie: 'session_id=12345; auth_token=secret_jwt' } };
    let nextCalled = false;
    cookieParserMiddleware(req, {}, () => { nextCalled = true; });
    assert.strictEqual(nextCalled, true);
    assert.strictEqual(req.cookies.session_id, '12345');
    assert.strictEqual(req.cookies.auth_token, 'secret_jwt');
  });

  it('should handle URL-encoded cookie values', () => {
    const req = { headers: { cookie: 'username=John%20Doe; role=SUPER_ADMIN' } };
    cookieParserMiddleware(req, {}, () => {});
    assert.strictEqual(req.cookies.username, 'John Doe');
    assert.strictEqual(req.cookies.role, 'SUPER_ADMIN');
  });

  it('should handle malformed or empty cookies gracefully without throwing', () => {
    const req = { headers: { cookie: ';;; =val; empty=; normal=ok; %invalid=bad' } };
    assert.doesNotThrow(() => {
      cookieParserMiddleware(req, {}, () => {});
    });
    assert.strictEqual(req.cookies.normal, 'ok');
  });

  it('should merge pre-existing req.cookies with incoming parsed cookies', () => {
    const existing = { pre_existing: 'saved_value' };
    const req = { headers: { cookie: 'header_token=abc123xyz' }, cookies: existing };
    cookieParserMiddleware(req, {}, () => {});
    assert.strictEqual(req.cookies.pre_existing, 'saved_value');
    assert.strictEqual(req.cookies.header_token, 'abc123xyz');
  });
});

describe('CacheService & Memory Fallback Behavior', () => {
  let cacheService;

  before(() => {
    // Provide a mock ConfigService with no Redis URL to test fallback
    const mockConfig = {
      get: (key, defaultValue) => {
        if (key === 'REDIS_URL') return null;
        return defaultValue;
      }
    };
    cacheService = new CacheService(mockConfig);
  });

  after(async () => {
    if (cacheService) {
      await cacheService.onModuleDestroy();
    }
  });

  it('should store and retrieve data from memory cache', async () => {
    await cacheService.set('test:key1', { name: 'ADL Kairouan', active: true }, 60);
    const value = await cacheService.get('test:key1');
    assert.deepStrictEqual(value, { name: 'ADL Kairouan', active: true });
  });

  it('should return null for non-existent keys', async () => {
    const value = await cacheService.get('test:non_existent');
    assert.strictEqual(value, null);
  });

  it('should delete keys properly', async () => {
    await cacheService.set('test:del_key', 'temporary', 60);
    assert.strictEqual(await cacheService.get('test:del_key'), 'temporary');
    await cacheService.del('test:del_key');
    assert.strictEqual(await cacheService.get('test:del_key'), null);
  });

  it('should support wrap method: computes only on miss and caches result', async () => {
    let executionCount = 0;
    const fetcher = async () => {
      executionCount++;
      return { total: 42 };
    };

    // First call (cache miss -> computes)
    const res1 = await cacheService.wrap('test:wrap_key', fetcher, 60);
    assert.strictEqual(executionCount, 1);
    assert.deepStrictEqual(res1, { total: 42 });

    // Second call (cache hit -> does not execute fetcher)
    const res2 = await cacheService.wrap('test:wrap_key', fetcher, 60);
    assert.strictEqual(executionCount, 1);
    assert.deepStrictEqual(res2, { total: 42 });
  });

  it('should expire keys when TTL passes', async () => {
    // Set with 0 or negative TTL to simulate expiration
    await cacheService.set('test:expired_key', 'old_data', -1);
    const value = await cacheService.get('test:expired_key');
    assert.strictEqual(value, null);
  });

  it('should clear all keys on reset', async () => {
    await cacheService.set('test:k1', 'v1', 60);
    await cacheService.set('test:k2', 'v2', 60);
    await cacheService.reset();
    assert.strictEqual(await cacheService.get('test:k1'), null);
    assert.strictEqual(await cacheService.get('test:k2'), null);
  });
});
