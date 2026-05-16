import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PublishStatus } from '@prisma/client';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { PaginationDto, paginate } from '../../common/dto/pagination.dto';
import slugify from 'slugify';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.blogPost.create({
      data: {
        ...rest,
        slug,
        readingTime,
        authorId,
        ...(tagIds?.length && { tags: { connect: tagIds.map((id) => ({ id })) } }),
      },
      include: { category: true, tags: true, author: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async findAll(query: PaginationDto & { status?: PublishStatus; categoryId?: string; featured?: boolean; tagId?: string }) {
    const { page = 1, limit = 10, search, status, categoryId, featured, tagId, sortBy = 'createdAt', sortOrder = 'desc' } = query;
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
            select: { comments: { where: { isPublic: true } } }
          }
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return paginate(items, total, page, limit);
  }

  async findPublished(query: PaginationDto & { categoryId?: string; tagId?: string }) {
    return this.findAll({ ...query, status: PublishStatus.PUBLISHED });
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

    return this.prisma.blogPost.update({
      where: { id },
      data: {
        ...rest,
        ...(tagIds !== undefined && { tags: { set: tagIds.map((tagId) => ({ id: tagId })) } }),
      },
      include: { category: true, tags: true, author: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async remove(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id, deletedAt: null } });
    if (!post) throw new NotFoundException('Blog post not found');
    return this.prisma.blogPost.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async togglePublish(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id, deletedAt: null } });
    if (!post) throw new NotFoundException('Blog post not found');
    const newStatus = post.status === PublishStatus.PUBLISHED ? PublishStatus.DRAFT : PublishStatus.PUBLISHED;
    return this.prisma.blogPost.update({
      where: { id },
      data: { status: newStatus, publishedAt: newStatus === PublishStatus.PUBLISHED ? new Date() : null },
    });
  }

  async toggleFeatured(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id, deletedAt: null } });
    if (!post) throw new NotFoundException('Blog post not found');
    return this.prisma.blogPost.update({ where: { id }, data: { featured: !post.featured } });
  }

  async getFeatured(limit = 6) {
    return this.prisma.blogPost.findMany({
      where: { featured: true, status: PublishStatus.PUBLISHED, deletedAt: null },
      take: limit,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { publishedAt: 'desc' },
    });
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
      orderBy: { publishedAt: 'desc' },
    });
  }

  // ─── Engagement Methods ──────────────────────────────────────────────────

  async like(id: string) {
    return this.prisma.blogPost.update({
      where: { id },
      data: { likes: { increment: 1 } },
      select: { id: true, likes: true }
    });
  }

  async addComment(id: string, dto: { name: string; content: string; email?: string }) {
    return this.prisma.blogComment.create({
      data: {
        name: dto.name,
        content: dto.content,
        email: dto.email,
        blogPostId: id,
        isPublic: true, // Default to public for now
      }
    });
  }

  async getComments(postId: string) {
    return this.prisma.blogComment.findMany({
      where: { blogPostId: postId, isPublic: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}
