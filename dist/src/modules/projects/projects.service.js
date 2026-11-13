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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
const client_1 = require("@prisma/client");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const slugify_1 = require("slugify");
let ProjectsService = class ProjectsService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async invalidateCache() {
        await this.cache.delByPrefix('projects:public');
    }
    generateSlug(title) {
        return (0, slugify_1.default)(title, { lower: true, strict: true, locale: 'fr' });
    }
    async create(dto) {
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
    async findAll(query) {
        const { page = 1, limit = 10, search, status, categoryId, featured, sortBy = 'order', sortOrder = 'asc' } = query;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
            ...(status && { status }),
            ...(categoryId && { categoryId }),
            ...(featured !== undefined && { featured }),
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
            this.prisma.project.findMany({
                where,
                skip,
                take: limit,
                include: { category: { select: { id: true, name: true, slug: true } } },
                orderBy,
            }),
            this.prisma.project.count({ where }),
        ]);
        return (0, pagination_dto_1.paginate)(items, total, page, limit);
    }
    async findPublished(query) {
        const cacheKey = `projects:public:${JSON.stringify(query)}`;
        return this.cache.wrap(cacheKey, async () => {
            const { page = 1, limit = 10, search, categoryId, featured } = query;
            const skip = (page - 1) * limit;
            const where = {
                deletedAt: null,
                status: client_1.PublishStatus.PUBLISHED,
                ...(categoryId && { categoryId }),
                ...(featured !== undefined && { featured }),
                ...(search && {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { excerpt: { contains: search, mode: 'insensitive' } },
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
            return (0, pagination_dto_1.paginate)(items, total, page, limit);
        }, 300);
    }
    async findOne(id) {
        const project = await this.prisma.project.findUnique({
            where: { id, deletedAt: null },
            include: { category: true },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        await this.prisma.project.update({ where: { id }, data: { views: { increment: 1 } } });
        return project;
    }
    async findBySlug(slug) {
        const project = await this.prisma.project.findUnique({
            where: { slug, deletedAt: null, status: client_1.PublishStatus.PUBLISHED },
            include: { category: true },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        await this.prisma.project.update({ where: { id: project.id }, data: { views: { increment: 1 } } });
        return project;
    }
    async update(id, dto) {
        const project = await this.prisma.project.findUnique({ where: { id, deletedAt: null } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        const data = { ...dto };
        if (dto.title && !dto.slug)
            data.slug = this.generateSlug(dto.title);
        const updated = await this.prisma.project.update({ where: { id }, data, include: { category: true } });
        await this.invalidateCache();
        return updated;
    }
    async reorder(items) {
        await this.prisma.$transaction(items.map((item) => this.prisma.project.update({
            where: { id: item.id },
            data: { order: item.order },
        })));
        await this.invalidateCache();
        return { success: true, count: items.length };
    }
    async remove(id) {
        const project = await this.prisma.project.findUnique({ where: { id, deletedAt: null } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        const removed = await this.prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
        await this.invalidateCache();
        return removed;
    }
    async togglePublish(id) {
        const project = await this.prisma.project.findUnique({ where: { id, deletedAt: null } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        const newStatus = project.status === client_1.PublishStatus.PUBLISHED ? client_1.PublishStatus.DRAFT : client_1.PublishStatus.PUBLISHED;
        const updated = await this.prisma.project.update({
            where: { id },
            data: { status: newStatus, publishedAt: newStatus === client_1.PublishStatus.PUBLISHED ? new Date() : null },
        });
        await this.invalidateCache();
        return updated;
    }
    async toggleFeatured(id) {
        const project = await this.prisma.project.findUnique({ where: { id, deletedAt: null } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        const updated = await this.prisma.project.update({ where: { id }, data: { featured: !project.featured } });
        await this.invalidateCache();
        return updated;
    }
    async archive(id) {
        const project = await this.prisma.project.findUnique({ where: { id, deletedAt: null } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        const updated = await this.prisma.project.update({ where: { id }, data: { status: client_1.PublishStatus.ARCHIVED } });
        await this.invalidateCache();
        return updated;
    }
    async getFeatured(limit = 6) {
        return this.cache.wrap(`projects:public:featured:${limit}`, async () => {
            return this.prisma.project.findMany({
                where: { featured: true, status: client_1.PublishStatus.PUBLISHED, deletedAt: null },
                take: limit,
                include: { category: { select: { id: true, name: true, slug: true } } },
                orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
            });
        }, 300);
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map