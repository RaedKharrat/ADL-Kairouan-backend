import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { PublishStatus } from '@prisma/client';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import { ReorderItemDto } from '../../common/dto/reorder.dto';
import slugify from 'slugify';

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

  private async invalidateCache() {
    await this.cache.delByPrefix('blog:public');
  }

  private generateSlug(title: string): string {
    return slugify(title, { lower: true, strict: true, locale: 'fr' });
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  }

  async create(dto: CreateBlogPostDto, authorId: string) {
    const slug = dto.slug || this.generateSlug(dto.title);
    const readingTime = dto.content ? this.calculateReadingTime(dto.content) : 1;
    const { tagIds, ...rest } = dto;

    let order = dto.order;
    if (order === undefined || order === null) {
      const highest = await this.prisma.blogPost.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = (highest?.order ?? -1) + 1;
    }

    const post = await this.prisma.blogPost.create({
      data: {
        ...rest,
        order,
        slug,
        readingTime,
        authorId,
        ...(tagIds?.length && { tags: { connect: tagIds.map((id) => ({ id })) } }),
      },
      include: { category: true, tags: true, author: { select: { id: true, name: true, avatar: true } } },
    });

    await this.invalidateCache();
    return post;
  }

  async findAll(query: PaginationDto & { status?: PublishStatus; categoryId?: string; featured?: boolean; tagId?: string }) {
    const { page = 1, limit = 10, search, status, categoryId, featured, tagId, sortBy = 'order', sortOrder = 'asc' } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      deletedAt: null,
      ...(status && { status }),
      ...(categoryId && { categoryId }),
      ...(featured !== undefined && { featured }),
      ...(tagId && { tags: { some: { id: tagId } } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy =
      sortBy === 'order'
        ? [{ order: sortOrder }, { createdAt: 'desc' as const }]
        : [{ [sortBy]: sortOrder }, { order: 'asc' as const }];

    const [items, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          tags: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, name: true, avatar: true } },
          _count: {
            select: { comments: { where: { isPublic: true } } },
          },
        },
        orderBy,
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return paginate(items, total, page, limit);
  }

  async findPublished(query: PaginationDto & { categoryId?: string; tagId?: string }) {
    const cacheKey = `blog:public:${JSON.stringify(query)}`;
    return this.cache.wrap(
      cacheKey,
      async () => {
        const { page = 1, limit = 10, search, categoryId, tagId } = query;
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {
          deletedAt: null,
          status: PublishStatus.PUBLISHED,
          ...(categoryId && { categoryId }),
          ...(tagId && { tags: { some: { id: tagId } } }),
          ...(search && {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { excerpt: { contains: search, mode: 'insensitive' } },
            ],
          }),
        };

        const [items, total] = await Promise.all([
          this.prisma.blogPost.findMany({
            where,
            skip,
            take: limit,
            include: {
              category: { select: { id: true, name: true, slug: true } },
              tags: { select: { id: true, name: true, slug: true } },
              author: { select: { id: true, name: true, avatar: true } },
              _count: {
                select: { comments: { where: { isPublic: true } } },
              },
            },
            orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
          }),
          this.prisma.blogPost.count({ where }),
        ]);

        return paginate(items, total, page, limit);
      },
      300, // 5 min cache
    );
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug, deletedAt: null, status: PublishStatus.PUBLISHED },
      include: {
        category: true,
        tags: true,
        author: { select: { id: true, name: true, avatar: true } },
      },
    });
    if (!post) throw new NotFoundException('Blog post not found');
    await this.prisma.blogPost.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
    return post;
  }

  async findOne(id: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id, deletedAt: null },
      include: { category: true, tags: true, author: { select: { id: true, name: true, avatar: true } } },
    });
    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }

  async update(id: string, dto: UpdateBlogPostDto) {
    const post = await this.prisma.blogPost.findUnique({ where: { id, deletedAt: null } });
    if (!post) throw new NotFoundException('Blog post not found');

    const data: Record<string, unknown> = { ...dto };
    if (dto.title && !dto.slug) data.slug = this.generateSlug(dto.title);
    if (dto.content) data.readingTime = this.calculateReadingTime(dto.content);

    const { tagIds, ...rest } = data as { tagIds?: string[] } & Record<string, unknown>;

    const updated = await this.prisma.blogPost.update({
      where: { id },
      data: {
        ...rest,
        ...(tagIds !== undefined && { tags: { set: tagIds.map((tagId) => ({ id: tagId })) } }),
      },
      include: { category: true, tags: true, author: { select: { id: true, name: true, avatar: true } } },
    });

    await this.invalidateCache();
    return updated;
  }

  async reorder(items: ReorderItemDto[]) {
    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.blogPost.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    await this.invalidateCache();
    return { success: true, count: items.length };
  }

  async remove(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id, deletedAt: null } });
    if (!post) throw new NotFoundException('Blog post not found');
    const removed = await this.prisma.blogPost.update({ where: { id }, data: { deletedAt: new Date() } });
    await this.invalidateCache();
    return removed;
  }

  async togglePublish(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id, deletedAt: null } });
    if (!post) throw new NotFoundException('Blog post not found');
    const newStatus = post.status === PublishStatus.PUBLISHED ? PublishStatus.DRAFT : PublishStatus.PUBLISHED;
    const updated = await this.prisma.blogPost.update({
      where: { id },
      data: { status: newStatus, publishedAt: newStatus === PublishStatus.PUBLISHED ? new Date() : null },
    });
    await this.invalidateCache();
    return updated;
  }

  async toggleFeatured(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id, deletedAt: null } });
    if (!post) throw new NotFoundException('Blog post not found');
    const updated = await this.prisma.blogPost.update({ where: { id }, data: { featured: !post.featured } });
    await this.invalidateCache();
    return updated;
  }

  async getFeatured(limit = 6) {
    return this.cache.wrap(
      `blog:public:featured:${limit}`,
      async () => {
        return this.prisma.blogPost.findMany({
          where: { featured: true, status: PublishStatus.PUBLISHED, deletedAt: null },
          take: limit,
          include: {
            category: { select: { id: true, name: true, slug: true } },
            author: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
        });
      },
      300,
    );
  }

  async getRelated(id: string, limit = 4) {
    const post = await this.prisma.blogPost.findUnique({ where: { id }, include: { tags: true } });
    if (!post) return [];
    const tagIds = post.tags.map((t) => t.id);
    return this.prisma.blogPost.findMany({
      where: {
        id: { not: id },
        status: PublishStatus.PUBLISHED,
        deletedAt: null,
        OR: [
          { categoryId: post.categoryId ?? undefined },
          ...(tagIds.length ? [{ tags: { some: { id: { in: tagIds } } } }] : []),
        ],
      },
      take: limit,
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
    });
  }

  // ─── Engagement Methods ──────────────────────────────────────────────────

  async like(id: string) {
    return this.prisma.blogPost.update({
      where: { id },
      data: { likes: { increment: 1 } },
      select: { id: true, likes: true },
    });
  }

  async addComment(id: string, dto: { name: string; content: string; email?: string }) {
    return this.prisma.blogComment.create({
      data: {
        name: dto.name,
        content: dto.content,
        email: dto.email,
        blogPostId: id,
        isPublic: true,
      },
    });
  }

  async getComments(postId: string) {
    return this.prisma.blogComment.findMany({
      where: { blogPostId: postId, isPublic: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
