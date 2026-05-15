import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';

@Injectable()
export class VideosService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: { title: string; description?: string; url?: string; youtubeId?: string; thumbnail?: string; duration?: string; featured?: boolean; order?: number }) {
    return this.prisma.video.create({ data: dto });
  }

  async findAll(query: PaginationDto & { featured?: boolean }) {
    const { page = 1, limit = 12, search, featured } = query;
    const skip = (page - 1) * limit;
    const where = {
      ...(featured !== undefined && { featured }),
      ...(search && { OR: [{ title: { contains: search, mode: 'insensitive' as const } }] }),
    };
    const [items, total] = await Promise.all([
      this.prisma.video.findMany({ where, skip, take: limit, orderBy: { order: 'asc' } }),
      this.prisma.video.count({ where }),
    ]);
    return paginate(items, total, page, limit);
  }

  async findOne(id: string) {
    const v = await this.prisma.video.findUnique({ where: { id } });
    if (!v) throw new NotFoundException('Video not found');
    return v;
  }

  async update(id: string, dto: any) { await this.findOne(id); return this.prisma.video.update({ where: { id }, data: dto }); }
  async remove(id: string) { await this.findOne(id); return this.prisma.video.delete({ where: { id } }); }
  getFeatured(limit = 6) { return this.prisma.video.findMany({ where: { featured: true, isActive: true }, take: limit, orderBy: { order: 'asc' } }); }
}
