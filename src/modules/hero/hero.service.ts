import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HeroService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.heroSlide.findMany({ orderBy: { order: 'asc' } });
  }

  findActive() {
    return this.prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });
  }

  findOne(id: string) {
    return this.prisma.heroSlide.findUnique({ where: { id } });
  }

  create(data: { title: string; subtitle?: string; ctaText?: string; ctaLink?: string; image: string; order?: number }) {
    return this.prisma.heroSlide.create({ data });
  }

  async update(id: string, data: Partial<{ title: string; subtitle: string; ctaText: string; ctaLink: string; image: string; order: number; isActive: boolean }>) {
    const slide = await this.prisma.heroSlide.findUnique({ where: { id } });
    if (!slide) throw new NotFoundException('Hero slide not found');
    return this.prisma.heroSlide.update({ where: { id }, data });
  }

  async remove(id: string) {
    const slide = await this.prisma.heroSlide.findUnique({ where: { id } });
    if (!slide) throw new NotFoundException('Hero slide not found');
    return this.prisma.heroSlide.delete({ where: { id } });
  }
}
