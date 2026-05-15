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
const client_1 = require("@prisma/client");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const slugify_1 = require("slugify");
let BlogService = class BlogService {
    constructor(prisma) {
        this.prisma = prisma;
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
    async findAll(query) {
        const { page = 1, limit = 10, search, status, categoryId, featured, tagId, sortBy = 'createdAt', sortOrder = 'desc' } = query;
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
        const [items, total] = await Promise.all([
            this.prisma.blogPost.findMany({
                where,
                skip,
                take: limit,
                include: {
                    category: { select: { id: true, name: true, slug: true } },
                    tags: { select: { id: true, name: true, slug: true } },
                    author: { select: { id: true, name: true, avatar: true } },
                },
                orderBy: { [sortBy]: sortOrder },
            }),
            this.prisma.blogPost.count({ where }),
        ]);
        return (0, pagination_dto_1.paginate)(items, total, page, limit);
    }
    async findPublished(query) {
        return this.findAll({ ...query, status: client_1.PublishStatus.PUBLISHED });
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
        return this.prisma.blogPost.update({
            where: { id },
            data: {
                ...rest,
                ...(tagIds !== undefined && { tags: { set: tagIds.map((tagId) => ({ id: tagId })) } }),
            },
            include: { category: true, tags: true, author: { select: { id: true, name: true, avatar: true } } },
        });
    }
    async remove(id) {
        const post = await this.prisma.blogPost.findUnique({ where: { id, deletedAt: null } });
        if (!post)
            throw new common_1.NotFoundException('Blog post not found');
        return this.prisma.blogPost.update({ where: { id }, data: { deletedAt: new Date() } });
    }
    async togglePublish(id) {
        const post = await this.prisma.blogPost.findUnique({ where: { id, deletedAt: null } });
        if (!post)
            throw new common_1.NotFoundException('Blog post not found');
        const newStatus = post.status === client_1.PublishStatus.PUBLISHED ? client_1.PublishStatus.DRAFT : client_1.PublishStatus.PUBLISHED;
        return this.prisma.blogPost.update({
            where: { id },
            data: { status: newStatus, publishedAt: newStatus === client_1.PublishStatus.PUBLISHED ? new Date() : null },
        });
    }
    async toggleFeatured(id) {
        const post = await this.prisma.blogPost.findUnique({ where: { id, deletedAt: null } });
        if (!post)
            throw new common_1.NotFoundException('Blog post not found');
        return this.prisma.blogPost.update({ where: { id }, data: { featured: !post.featured } });
    }
    async getFeatured(limit = 6) {
        return this.prisma.blogPost.findMany({
            where: { featured: true, status: client_1.PublishStatus.PUBLISHED, deletedAt: null },
            take: limit,
            include: {
                category: { select: { id: true, name: true, slug: true } },
                author: { select: { id: true, name: true, avatar: true } },
            },
            orderBy: { publishedAt: 'desc' },
        });
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
            orderBy: { publishedAt: 'desc' },
        });
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlogService);
//# sourceMappingURL=blog.service.js.map