import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../common/cache/cache.service';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) { }

  findAll() {
    return this.prisma.statistic.findMany({ orderBy: { order: 'asc' } });
  }

  async findActive() {
    return this.cache.wrap('statistics:active', () => {
      return this.prisma.statistic.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });
    }, 600);
  }

  async create(data: { label: string; value: string; icon?: string; suffix?: string; order?: number }) {
    const stat = await this.prisma.statistic.create({ data });
    await this.cache.del('statistics:active');
    return stat;
  }

  async update(id: string, data: Partial<{ label: string; value: string; icon: string; suffix: string; order: number; isActive: boolean }>) {
    const stat = await this.prisma.statistic.findUnique({ where: { id } });
    if (!stat) throw new NotFoundException('Statistic not found');
    const updated = await this.prisma.statistic.update({ where: { id }, data });
    await this.cache.del('statistics:active');
    return updated;
  }

  async remove(id: string) {
    const stat = await this.prisma.statistic.findUnique({ where: { id } });
    if (!stat) throw new NotFoundException('Statistic not found');
    const deleted = await this.prisma.statistic.delete({ where: { id } });
    await this.cache.del('statistics:active');
    return deleted;
  }
}
