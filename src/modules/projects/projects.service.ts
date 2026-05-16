import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PublishStatus } from '@prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import slugify from 'slugify';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateSlug(title: string): string {
    return slugify(title, { lower: true, strict: true, locale: 'fr' });
  }

  async create(dto: CreateProjectDto) {
    const slug = dto.slug || this.generateSlug(dto.title);
    return this.prisma.project.create({ data: { ...dto, slug } });
  }

  async findAll(query: PaginationDto & { status?: PublishStatus; categoryId?: string; featured?: boolean }) {
    const { page = 1, limit = 10, search, status, categoryId, featured, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(status && { status }),
      ...(categoryId && { categoryId }),
      ...(featured !== undefined && { featured }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { excerpt: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        include: { category: { select: { id: true, name: true, slug: true } } },
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.project.count({ where }),
    ]);

    return paginate(items, total, page, limit);
  }

  async findPublished(query: PaginationDto & { categoryId?: string; featured?: boolean }) {
    return this.findAll({ ...query, status: PublishStatus.PUBLISHED });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id, deletedAt: null },
      include: { category: true },
    });
    if (!project) throw new NotFoundException('Project not found');
    await this.prisma.project.update({ where: { id }, data: { views: { increment: 1 } } });
    return project;
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug, deletedAt: null, status: PublishStatus.PUBLISHED },
      include: { category: true },
    });
    if (!project) throw new NotFoundException('Project not found');
    await this.prisma.project.update({ where: { id: project.id }, data: { views: { increment: 1 } } });
    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id, deletedAt: null } });
    if (!project) throw new NotFoundException('Project not found');

    const data = { ...dto };
    if (dto.title && !dto.slug) data.slug = this.generateSlug(dto.title);

    return this.prisma.project.update({ where: { id }, data, include: { category: true } });
  }

  async remove(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id, deletedAt: null } });
    if (!project) throw new NotFoundException('Project not found');
    return this.prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async togglePublish(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id, deletedAt: null } });
    if (!project) throw new NotFoundException('Project not found');
    const newStatus = project.status === PublishStatus.PUBLISHED ? PublishStatus.DRAFT : PublishStatus.PUBLISHED;
    return this.prisma.project.update({
      where: { id },
      data: { status: newStatus, publishedAt: newStatus === PublishStatus.PUBLISHED ? new Date() : null },
    });
  }

  async toggleFeatured(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id, deletedAt: null } });
    if (!project) throw new NotFoundException('Project not found');
    return this.prisma.project.update({ where: { id }, data: { featured: !project.featured } });
  }

  async archive(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id, deletedAt: null } });
    if (!project) throw new NotFoundException('Project not found');
    return this.prisma.project.update({ where: { id }, data: { status: PublishStatus.ARCHIVED } });
  }

  async getFeatured(limit = 6) {
    return this.prisma.project.findMany({
      where: { featured: true, status: PublishStatus.PUBLISHED, deletedAt: null },
      take: limit,
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: { publishedAt: 'desc' },
    });
  }
}
