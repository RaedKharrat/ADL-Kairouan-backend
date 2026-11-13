import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { ReorderItemDto } from '../../common/dto/reorder.dto';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsString() fileUrl: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fileType?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() fileSize?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() year?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() published?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() featured?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() categoryId?: string;
  @ApiPropertyOptional({ default: 0 }) @IsOptional() @IsNumber() order?: number;
}

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  private async invalidateCache() {
    await this.cache.delByPrefix('reports:public');
  }

  async create(dto: CreateReportDto) {
    const { title, description, fileUrl, fileType, fileSize, year, published, featured, categoryId } = dto;
    let order = dto.order;
    if (order === undefined || order === null) {
      const highest = await this.prisma.report.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = (highest?.order ?? -1) + 1;
    }

    const report = await this.prisma.report.create({
      data: {
        title,
        description,
        fileUrl,
        fileType,
        fileSize,
        year,
        published,
        featured,
        order,
        categoryId: categoryId || undefined,
      },
      include: { category: true },
    });

    await this.invalidateCache();
    return report;
  }

  async findAll(query: PaginationDto & { year?: number; published?: boolean; categoryId?: string }) {
    const { page = 1, limit = 10, search, year, published, categoryId, sortBy = 'order', sortOrder = 'asc' } = query;
    const skip = (page - 1) * limit;
    const where = {
      ...(year && { year }),
      ...(published !== undefined && { published }),
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const orderBy =
      sortBy === 'order'
        ? [{ order: sortOrder }, { year: 'desc' as const }, { createdAt: 'desc' as const }]
        : [{ [sortBy]: sortOrder }, { order: 'asc' as const }];

    const [items, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy,
      }),
      this.prisma.report.count({ where }),
    ]);
    return paginate(items, total, page, limit);
  }

  async findPublished(query: PaginationDto & { year?: number; categoryId?: string }) {
    const cacheKey = `reports:public:${JSON.stringify(query)}`;
    return this.cache.wrap(
      cacheKey,
      async () => {
        return this.findAll({ ...query, published: true, sortBy: 'order', sortOrder: 'asc' });
      },
      300,
    );
  }

  async findOne(id: string) {
    const r = await this.prisma.report.findUnique({ where: { id }, include: { category: true } });
    if (!r) throw new NotFoundException('Report not found');
    return r;
  }

  async update(id: string, dto: Partial<CreateReportDto>) {
    await this.findOne(id);
    const updated = await this.prisma.report.update({
      where: { id },
      data: {
        ...dto,
        categoryId: dto.categoryId || undefined,
      },
      include: { category: true },
    });
    await this.invalidateCache();
    return updated;
  }

  async reorder(items: ReorderItemDto[]) {
    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.report.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    await this.invalidateCache();
    return { success: true, count: items.length };
  }

  async remove(id: string) {
    await this.findOne(id);
    const deleted = await this.prisma.report.delete({ where: { id } });
    await this.invalidateCache();
    return deleted;
  }

  async incrementDownload(id: string) {
    return this.prisma.report.update({ where: { id }, data: { downloads: { increment: 1 } } });
  }
}
