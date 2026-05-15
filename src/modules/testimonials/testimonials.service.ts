import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TestimonialsService {
  constructor(private readonly prisma: PrismaService) {}
  create(dto: any) { return this.prisma.testimonial.create({ data: dto }); }
  findAll(activeOnly = false) { return this.prisma.testimonial.findMany({ where: activeOnly ? { isActive: true } : {}, orderBy: { order: 'asc' } }); }
  async findOne(id: string) { const t = await this.prisma.testimonial.findUnique({ where: { id } }); if (!t) throw new NotFoundException(); return t; }
  async update(id: string, dto: any) { await this.findOne(id); return this.prisma.testimonial.update({ where: { id }, data: dto }); }
  async remove(id: string) { await this.findOne(id); return this.prisma.testimonial.delete({ where: { id } }); }
  async reorder(ids: string[]) { return Promise.all(ids.map((id, i) => this.prisma.testimonial.update({ where: { id }, data: { order: i } }))); }
  getFeatured() { return this.prisma.testimonial.findMany({ where: { featured: true, isActive: true }, orderBy: { order: 'asc' } }); }
}
