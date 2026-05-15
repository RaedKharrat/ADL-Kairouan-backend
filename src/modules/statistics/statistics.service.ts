import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.statistic.findMany({ orderBy: { order: 'asc' } });
  }

  findActive() {
    return this.prisma.statistic.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });
  }

  create(data: { label: string; value: string; icon?: string; suffix?: string; order?: number }) {
    return this.prisma.statistic.create({ data });
  }

  async update(id: string, data: Partial<{ label: string; value: string; icon: string; suffix: string; order: number; isActive: boolean }>) {
    const stat = await this.prisma.statistic.findUnique({ where: { id } });
    if (!stat) throw new NotFoundException('Statistic not found');
    return this.prisma.statistic.update({ where: { id }, data });
  }

  async remove(id: string) {
    const stat = await this.prisma.statistic.findUnique({ where: { id } });
    if (!stat) throw new NotFoundException('Statistic not found');
    return this.prisma.statistic.delete({ where: { id } });
  }
}
