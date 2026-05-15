import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FaqService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: { question: string; answer: string; order?: number; categoryId?: string }) {
    return this.prisma.fAQ.create({ data: dto, include: { category: true } });
  }

  findAll(activeOnly = false, categoryId?: string) {
    return this.prisma.fAQ.findMany({
      where: { ...(activeOnly && { isActive: true }), ...(categoryId && { categoryId }) },
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const faq = await this.prisma.fAQ.findUnique({ where: { id }, include: { category: true } });
    if (!faq) throw new NotFoundException('FAQ not found');
    return faq;
  }

  async update(id: string, dto: Partial<{ question: string; answer: string; order: number; isActive: boolean; categoryId: string }>) {
    await this.findOne(id);
    return this.prisma.fAQ.update({ where: { id }, data: dto, include: { category: true } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.fAQ.delete({ where: { id } });
  }

  async reorder(ids: string[]) {
    return Promise.all(ids.map((id, index) => this.prisma.fAQ.update({ where: { id }, data: { order: index } })));
  }
}
