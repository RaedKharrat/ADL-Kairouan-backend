"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
const client_1 = require("@prisma/client");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const slugify_1 = require("slugify");
let BlogService = class BlogService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async invalidateCache() {
        await this.cache.delByPrefix('blog:public');
    }
    generateSlug(title) {
        return (0, slugify_1.default)(title, { lower: true, strict: true, locale: 'fr' });
    }
    calculateReadingTime(content) {
        const wordsPerMinute = 200;
        const words = content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
        return Math.max(1, Math.ceil(words / wordsPerMinute));
    }
    async create(dto, authorId) {
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
    async findAll(query) {
        const { page = 1, limit = 10, search, status, categoryId, featured, tagId, sortBy = 'order', sortOrder = 'asc' } = query;
        const skip = (page - 1) * limit;
        const where = {
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
        const orderBy = sortBy === 'order'
            ? [{ order: sortOrder }, { createdAt: 'desc' }]
            : [{ [sortBy]: sortOrder }, { order: 'asc' }];
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
        return (0, pagination_dto_1.paginate)(items, total, page, limit);
    }
    async findPublished(query) {
        const cacheKey = `blog:public:${JSON.stringify(query)}`;
        return this.cache.wrap(cacheKey, async () => {
            const { page = 1, limit = 10, search, categoryId, tagId } = query;
            const skip = (page - 1) * limit;
            const where = {
                deletedAt: null,
                status: client_1.PublishStatus.PUBLISHED,
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
            return (0, pagination_dto_1.paginate)(items, total, page, limit);
        }, 300);
    }
    async findBySlug(slug) {
        const post = await this.prisma.blogPost.findUnique({
            where: { slug, deletedAt: null, status: client_1.PublishStatus.PUBLISHED },
            include: {
                category: true,
                tags: true,
                author: { select: { id: true, name: true, avatar: true } },
            },
        });
        if (!post)
            throw new common_1.NotFoundException('Blog post not found');
        await this.prisma.blogPost.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
        return post;
    }
    async findOne(id) {
        const post = await this.prisma.blogPost.findUnique({
            where: { id, deletedAt: null },
            include: { category: true, tags: true, author: { select: { id: true, name: true, avatar: true } } },
        });
        if (!post)
            throw new common_1.NotFoundException('Blog post not found');
        return post;
    }
    async update(id, dto) {
        const post = await this.prisma.blogPost.findUnique({ where: { id, deletedAt: null } });
        if (!post)
            throw new common_1.NotFoundException('Blog post not found');
        const data = { ...dto };
        if (dto.title && !dto.slug)
            data.slug = this.generateSlug(dto.title);
        if (dto.content)
            data.readingTime = this.calculateReadingTime(dto.content);
        const { tagIds, ...rest } = data;
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
    async reorder(items) {
        await this.prisma.$transaction(items.map((item) => this.prisma.blogPost.update({
            where: { id: item.id },
            data: { order: item.order },
        })));
        await this.invalidateCache();
        return { success: true, count: items.length };
    }
    async remove(id) {
        const post = await this.prisma.blogPost.findUnique({ where: { id, deletedAt: null } });
        if (!post)
            throw new common_1.NotFoundException('Blog post not found');
        const removed = await this.prisma.blogPost.update({ where: { id }, data: { deletedAt: new Date() } });
        await this.invalidateCache();
        return removed;
    }
    async togglePublish(id) {
        const post = await this.prisma.blogPost.findUnique({ where: { id, deletedAt: null } });
        if (!post)
            throw new common_1.NotFoundException('Blog post not found');
        const newStatus = post.status === client_1.PublishStatus.PUBLISHED ? client_1.PublishStatus.DRAFT : client_1.PublishStatus.PUBLISHED;
        const updated = await this.prisma.blogPost.update({
            where: { id },
            data: { status: newStatus, publishedAt: newStatus === client_1.PublishStatus.PUBLISHED ? new Date() : null },
        });
        await this.invalidateCache();
        return updated;
    }
    async toggleFeatured(id) {
        const post = await this.prisma.blogPost.findUnique({ where: { id, deletedAt: null } });
        if (!post)
            throw new common_1.NotFoundException('Blog post not found');
        const updated = await this.prisma.blogPost.update({ where: { id }, data: { featured: !post.featured } });
        await this.invalidateCache();
        return updated;
    }
    async getFeatured(limit = 6) {
        return this.cache.wrap(`blog:public:featured:${limit}`, async () => {
            return this.prisma.blogPost.findMany({
                where: { featured: true, status: client_1.PublishStatus.PUBLISHED, deletedAt: null },
                take: limit,
                include: {
                    category: { select: { id: true, name: true, slug: true } },
                    author: { select: { id: true, name: true, avatar: true } },
                },
                orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
            });
        }, 300);
    }
    async getRelated(id, limit = 4) {
        const post = await this.prisma.blogPost.findUnique({ where: { id }, include: { tags: true } });
        if (!post)
            return [];
        const tagIds = post.tags.map((t) => t.id);
        return this.prisma.blogPost.findMany({
            where: {
                id: { not: id },
                status: client_1.PublishStatus.PUBLISHED,
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
    async like(id) {
        return this.prisma.blogPost.update({
            where: { id },
            data: { likes: { increment: 1 } },
            select: { id: true, likes: true },
        });
    }
    async addComment(id, dto) {
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
    async getComments(postId) {
        return this.prisma.blogComment.findMany({
            where: { blogPostId: postId, isPublic: true },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], BlogService);
//# sourceMappingURL=blog.service.js.map