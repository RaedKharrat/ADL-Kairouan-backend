import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SettingGroup } from '@prisma/client';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(group?: SettingGroup) {
    return this.prisma.siteSetting.findMany({ where: group ? { group } : {}, orderBy: { group: 'asc' } });
  }

  async findByKey(key: string) {
    return this.prisma.siteSetting.findUnique({ where: { key } });
  }

  async upsert(key: string, value: string, group?: SettingGroup, label?: string) {
    return this.prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value, group: group || SettingGroup.GENERAL, label },
    });
  }

  async upsertMany(settings: { key: string; value: string; group?: SettingGroup; label?: string }[]) {
    return Promise.all(settings.map((s) => this.upsert(s.key, s.value, s.group, s.label)));
  }

  async remove(key: string) {
    return this.prisma.siteSetting.delete({ where: { key } });
  }

  /** Returns settings as a key-value map — useful for public consumption */
  async getPublicSettings(): Promise<Record<string, string>> {
    const settings = await this.prisma.siteSetting.findMany({
      where: { group: { in: [SettingGroup.GENERAL, SettingGroup.SOCIAL, SettingGroup.CONTACT] } },
    });
    return Object.fromEntries(settings.map((s) => [s.key, s.value ?? '']));
  }
}
