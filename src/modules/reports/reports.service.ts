import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';

class CreateReportDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsString() fileUrl: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fileType?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() fileSize?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() year?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() published?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() featured?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() categoryId?: string;
}

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateReportDto) { 
    const { title, description, fileUrl, fileType, fileSize, year, published, featured, categoryId } = dto;
    return this.prisma.report.create({ 
      data: {
        title,
        description,
        fileUrl,
        fileType,
        fileSize,
        year,
        published,
        featured,
        categoryId: categoryId || undefined
      }, 
      include: { category: true } 
    }); 
  }

  async findAll(query: PaginationDto & { year?: number; published?: boolean; categoryId?: string }) {
    const { page = 1, limit = 10, search, year, published, categoryId } = query;
    const skip = (page - 1) * limit;
    const where = {
      ...(year && { year }),
      ...(published !== undefined && { published }),
      ...(categoryId && { categoryId }),
      ...(search && { OR: [{ title: { contains: search, mode: 'insensitive' as const } }, { description: { contains: search, mode: 'insensitive' as const } }] }),
    };
    const [items, total] = await Promise.all([
      this.prisma.report.findMany({ where, skip, take: limit, include: { category: true }, orderBy: [{ year: 'desc' }, { createdAt: 'desc' }] }),
      this.prisma.report.count({ where }),
    ]);
    return paginate(items, total, page, limit);
  }

  async findPublished(query: PaginationDto & { year?: number }) {
    return this.findAll({ ...query, published: true });
  }

  async findOne(id: string) {
    const r = await this.prisma.report.findUnique({ where: { id }, include: { category: true } });
    if (!r) throw new NotFoundException('Report not found');
    return r;
  }

  async update(id: string, dto: Partial<CreateReportDto>) {
    await this.findOne(id);
    return this.prisma.report.update({ where: { id }, data: dto, include: { category: true } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.report.delete({ where: { id } });
  }

  async incrementDownload(id: string) {
    return this.prisma.report.update({ where: { id }, data: { downloads: { increment: 1 } } });
  }
}
