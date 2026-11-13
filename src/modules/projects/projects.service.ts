import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { PublishStatus } from '@prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { ReorderItemDto } from '../../common/dto/reorder.dto';
import slugify from 'slugify';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  private async invalidateCache() {
    await this.cache.delByPrefix('projects:public');
  }

  private generateSlug(title: string): string {
    return slugify(title, { lower: true, strict: true, locale: 'fr' });
  }

  async create(dto: CreateProjectDto) {
    const slug = dto.slug || this.generateSlug(dto.title);
    let order = dto.order;
    if (order === undefined || order === null) {
      const highest = await this.prisma.project.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = (highest?.order ?? -1) + 1;
    }

    const project = await this.prisma.project.create({
      data: { ...dto, slug, order },
    });

    await this.invalidateCache();
    return project;
  }

  async findAll(query: PaginationDto & { status?: PublishStatus; categoryId?: string; featured?: boolean }) {
    const { page = 1, limit = 10, search, status, categoryId, featured, sortBy = 'order', sortOrder = 'asc' } = query;
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

    const orderBy =
      sortBy === 'order'
        ? [{ order: sortOrder }, { createdAt: 'desc' as const }]
        : [{ [sortBy]: sortOrder }, { order: 'asc' as const }];

    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        include: { category: { select: { id: true, name: true, slug: true } } },
        orderBy,
      }),
      this.prisma.project.count({ where }),
    ]);

    return paginate(items, total, page, limit);
  }

  async findPublished(query: PaginationDto & { categoryId?: string; featured?: boolean }) {
    const cacheKey = `projects:public:${JSON.stringify(query)}`;
    return this.cache.wrap(
      cacheKey,
      async () => {
        const { page = 1, limit = 10, search, categoryId, featured } = query;
        const skip = (page - 1) * limit;

        const where = {
          deletedAt: null,
          status: PublishStatus.PUBLISHED,
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
            orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
          }),
          this.prisma.project.count({ where }),
        ]);

        return paginate(items, total, page, limit);
      },
      300, // 5 min cache
    );
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

    const updated = await this.prisma.project.update({ where: { id }, data, include: { category: true } });
    await this.invalidateCache();
    return updated;
  }

  async reorder(items: ReorderItemDto[]) {
    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.project.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    await this.invalidateCache();
    return { success: true, count: items.length };
  }

  async remove(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id, deletedAt: null } });
    if (!project) throw new NotFoundException('Project not found');
    const removed = await this.prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
    await this.invalidateCache();
    return removed;
  }

  async togglePublish(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id, deletedAt: null } });
    if (!project) throw new NotFoundException('Project not found');
    const newStatus = project.status === PublishStatus.PUBLISHED ? PublishStatus.DRAFT : PublishStatus.PUBLISHED;
    const updated = await this.prisma.project.update({
      where: { id },
      data: { status: newStatus, publishedAt: newStatus === PublishStatus.PUBLISHED ? new Date() : null },
    });
    await this.invalidateCache();
    return updated;
  }

  async toggleFeatured(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id, deletedAt: null } });
    if (!project) throw new NotFoundException('Project not found');
    const updated = await this.prisma.project.update({ where: { id }, data: { featured: !project.featured } });
    await this.invalidateCache();
    return updated;
  }

  async archive(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id, deletedAt: null } });
    if (!project) throw new NotFoundException('Project not found');
    const updated = await this.prisma.project.update({ where: { id }, data: { status: PublishStatus.ARCHIVED } });
    await this.invalidateCache();
    return updated;
  }

  async getFeatured(limit = 6) {
    return this.cache.wrap(
      `projects:public:featured:${limit}`,
      async () => {
        return this.prisma.project.findMany({
          where: { featured: true, status: PublishStatus.PUBLISHED, deletedAt: null },
          take: limit,
          include: { category: { select: { id: true, name: true, slug: true } } },
          orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
        });
      },
      300,
    );
  }
}
