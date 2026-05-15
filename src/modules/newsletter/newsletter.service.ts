import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

@Injectable()
export class NewsletterService {
  constructor(private readonly prisma: PrismaService) {}

  async subscribe(email: string, name?: string, ip?: string) {
    const existing = await this.prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (existing.isActive) throw new ConflictException('Already subscribed');
      return this.prisma.newsletterSubscriber.update({ where: { email }, data: { isActive: true, name } });
    }
    return this.prisma.newsletterSubscriber.create({ data: { email, name, ip } });
  }

  async unsubscribe(email: string) {
    const sub = await this.prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (!sub) throw new NotFoundException('Subscriber not found');
    return this.prisma.newsletterSubscriber.update({ where: { email }, data: { isActive: false } });
  }

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;
    const where = {
      ...(search && { OR: [{ email: { contains: search, mode: 'insensitive' as const } }, { name: { contains: search, mode: 'insensitive' as const } }] }),
    };
    const [items, total] = await Promise.all([
      this.prisma.newsletterSubscriber.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.newsletterSubscriber.count({ where }),
    ]);
    return paginate(items, total, page, limit);
  }

  async remove(id: string) {
    return this.prisma.newsletterSubscriber.delete({ where: { id } });
  }

  async getStats() {
    const [total, active] = await Promise.all([
      this.prisma.newsletterSubscriber.count(),
      this.prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    ]);
    return { total, active, inactive: total - active };
  }
}
