import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactMessageDto, ip?: string, userAgent?: string) {
    return this.prisma.contactMessage.create({ data: { ...dto, ip, userAgent } });
  }

  async findAll(query: PaginationDto & { isRead?: boolean; isArchived?: boolean }) {
    const { page = 1, limit = 10, search, isRead, isArchived = false } = query;
    const skip = (page - 1) * limit;
    const where = {
      ...(isRead !== undefined && { isRead }),
      isArchived,
      ...(search && { OR: [{ name: { contains: search, mode: 'insensitive' as const } }, { email: { contains: search, mode: 'insensitive' as const } }, { subject: { contains: search, mode: 'insensitive' as const } }] }),
    };
    const [items, total] = await Promise.all([
      this.prisma.contactMessage.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.contactMessage.count({ where }),
    ]);
    return paginate(items, total, page, limit);
  }

  async findOne(id: string) {
    const msg = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) throw new NotFoundException('Message not found');
    if (!msg.isRead) await this.prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
    return msg;
  }

  async markRead(id: string) {
    return this.prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
  }

  async archive(id: string) {
    return this.prisma.contactMessage.update({ where: { id }, data: { isArchived: true } });
  }

  async remove(id: string) {
    const msg = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) throw new NotFoundException('Message not found');
    return this.prisma.contactMessage.delete({ where: { id } });
  }

  async getStats() {
    const [total, unread] = await Promise.all([
      this.prisma.contactMessage.count({ where: { isArchived: false } }),
      this.prisma.contactMessage.count({ where: { isRead: false, isArchived: false } }),
    ]);
    return { total, unread };
  }
}
