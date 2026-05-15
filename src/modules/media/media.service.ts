import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MediaType } from '@prisma/client';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationDto & { type?: MediaType; categoryId?: string; featured?: boolean }) {
    const { page = 1, limit = 20, search, type, categoryId, featured } = query;
    const skip = (page - 1) * limit;
    const where = {
      ...(type && { type }),
      ...(categoryId && { categoryId }),
      ...(featured !== undefined && { featured }),
      ...(search && { OR: [{ filename: { contains: search, mode: 'insensitive' as const } }, { alt: { contains: search, mode: 'insensitive' as const } }] }),
    };
    const [items, total] = await Promise.all([
      this.prisma.mediaItem.findMany({ where, skip, take: limit, include: { category: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } }),
      this.prisma.mediaItem.count({ where }),
    ]);
    return paginate(items, total, page, limit);
  }

  async findOne(id: string) {
    const m = await this.prisma.mediaItem.findUnique({ where: { id }, include: { category: true } });
    if (!m) throw new NotFoundException('Media item not found');
    return m;
  }

  async update(id: string, dto: { alt?: string; caption?: string; categoryId?: string; featured?: boolean }) {
    await this.findOne(id);
    return this.prisma.mediaItem.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.mediaItem.delete({ where: { id } });
  }

  async bulkDelete(ids: string[]) {
    return this.prisma.mediaItem.deleteMany({ where: { id: { in: ids } } });
  }

  // Categories
  findAllCategories() { return this.prisma.mediaCategory.findMany({ orderBy: { name: 'asc' } }); }
  createCategory(dto: { name: string; slug: string }) { return this.prisma.mediaCategory.create({ data: dto }); }
  deleteCategory(id: string) { return this.prisma.mediaCategory.delete({ where: { id } }); }
}
