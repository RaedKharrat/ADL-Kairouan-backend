import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { SettingGroup } from '@prisma/client';

@Injectable()
export class SettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  findAll(group?: SettingGroup) {
    return this.prisma.siteSetting.findMany({ where: group ? { group } : {}, orderBy: { group: 'asc' } });
  }

  async findByKey(key: string) {
    return this.prisma.siteSetting.findUnique({ where: { key } });
  }

  async upsert(key: string, value: string, group?: SettingGroup, label?: string) {
    const result = await this.prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value, group: group || SettingGroup.GENERAL, label },
    });
    await this.cache.del('settings:public');
    return result;
  }

  async upsertMany(settings: { key: string; value: string; group?: SettingGroup; label?: string }[]) {
    const result = await Promise.all(settings.map((s) => this.upsert(s.key, s.value, s.group, s.label)));
    await this.cache.del('settings:public');
    return result;
  }

  async remove(key: string) {
    const result = await this.prisma.siteSetting.delete({ where: { key } });
    await this.cache.del('settings:public');
    return result;
  }

  /** Returns settings as a key-value map — cached for high performance */
  async getPublicSettings(): Promise<Record<string, string>> {
    return this.cache.wrap('settings:public', async () => {
      const settings = await this.prisma.siteSetting.findMany({
        where: { group: { in: [SettingGroup.GENERAL, SettingGroup.SOCIAL, SettingGroup.CONTACT] } },
      });
      return Object.fromEntries(settings.map((s) => [s.key, s.value ?? '']));
    }, 600); // 10 minutes cache
  }
}
