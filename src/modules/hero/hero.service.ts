import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../common/cache/cache.service';

@Injectable()
export class HeroService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  findAll() {
    return this.prisma.heroSlide.findMany({ orderBy: { order: 'asc' } });
  }

  async findActive() {
    return this.cache.wrap('hero:active', () => {
      return this.prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });
    }, 600);
  }

  findOne(id: string) {
    return this.prisma.heroSlide.findUnique({ where: { id } });
  }

  async create(data: { title: string; subtitle?: string; ctaText?: string; ctaLink?: string; image: string; order?: number }) {
    const slide = await this.prisma.heroSlide.create({ data });
    await this.cache.del('hero:active');
    return slide;
  }

  async update(id: string, data: Partial<{ title: string; subtitle: string; ctaText: string; ctaLink: string; image: string; order: number; isActive: boolean }>) {
    const slide = await this.prisma.heroSlide.findUnique({ where: { id } });
    if (!slide) throw new NotFoundException('Hero slide not found');
    const updated = await this.prisma.heroSlide.update({ where: { id }, data });
    await this.cache.del('hero:active');
    return updated;
  }

  async remove(id: string) {
    const slide = await this.prisma.heroSlide.findUnique({ where: { id } });
    if (!slide) throw new NotFoundException('Hero slide not found');
    const deleted = await this.prisma.heroSlide.delete({ where: { id } });
    await this.cache.del('hero:active');
    return deleted;
  }
}
