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
const client_1 = require("@prisma/client");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const slugify_1 = require("slugify");
let ProjectsService = class ProjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateSlug(title) {
        return (0, slugify_1.default)(title, { lower: true, strict: true, locale: 'fr' });
    }
    async create(dto) {
        const slug = dto.slug || this.generateSlug(dto.title);
        return this.prisma.project.create({ data: { ...dto, slug } });
    }
    async findAll(query) {
        const { page = 1, limit = 10, search, status, categoryId, featured, sortBy = 'createdAt', sortOrder = 'desc' } = query;
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
        return (0, pagination_dto_1.paginate)(items, total, page, limit);
    }
    async findPublished(query) {
        return this.findAll({ ...query, status: client_1.PublishStatus.PUBLISHED });
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
        return this.prisma.project.update({ where: { id }, data, include: { category: true } });
    }
    async remove(id) {
        const project = await this.prisma.project.findUnique({ where: { id, deletedAt: null } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return this.prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
    }
    async togglePublish(id) {
        const project = await this.prisma.project.findUnique({ where: { id, deletedAt: null } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        const newStatus = project.status === client_1.PublishStatus.PUBLISHED ? client_1.PublishStatus.DRAFT : client_1.PublishStatus.PUBLISHED;
        return this.prisma.project.update({
            where: { id },
            data: { status: newStatus, publishedAt: newStatus === client_1.PublishStatus.PUBLISHED ? new Date() : null },
        });
    }
    async toggleFeatured(id) {
        const project = await this.prisma.project.findUnique({ where: { id, deletedAt: null } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        return this.prisma.project.update({ where: { id }, data: { featured: !project.featured } });
    }
    async getFeatured(limit = 6) {
        return this.prisma.project.findMany({
            where: { featured: true, status: client_1.PublishStatus.PUBLISHED, deletedAt: null },
            take: limit,
            include: { category: { select: { id: true, name: true, slug: true } } },
            orderBy: { publishedAt: 'desc' },
        });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map