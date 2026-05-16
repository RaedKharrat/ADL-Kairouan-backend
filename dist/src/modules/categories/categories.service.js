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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const slugify_1 = require("slugify");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    slug(name) {
        return (0, slugify_1.default)(name, { lower: true, strict: true });
    }
    findProjectCategories() {
        return this.prisma.projectCategory.findMany({
            orderBy: { order: 'asc' },
            include: { _count: { select: { projects: true } } }
        });
    }
    createProjectCategory(data) {
        return this.prisma.projectCategory.create({ data: { ...data, slug: this.slug(data.name) } });
    }
    async updateProjectCategory(id, data) {
        const cat = await this.prisma.projectCategory.findUnique({ where: { id } });
        if (!cat)
            throw new common_1.NotFoundException('Project category not found');
        return this.prisma.projectCategory.update({ where: { id }, data: { ...data, ...(data.name && { slug: this.slug(data.name) }) } });
    }
    async removeProjectCategory(id) {
        const cat = await this.prisma.projectCategory.findUnique({ where: { id } });
        if (!cat)
            throw new common_1.NotFoundException('Project category not found');
        return this.prisma.projectCategory.delete({ where: { id } });
    }
    findBlogCategories() {
        return this.prisma.blogCategory.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { posts: true } } }
        });
    }
    createBlogCategory(data) {
        return this.prisma.blogCategory.create({ data: { name: data.name, description: data.description, slug: this.slug(data.name) } });
    }
    async updateBlogCategory(id, data) {
        const cat = await this.prisma.blogCategory.findUnique({ where: { id } });
        if (!cat)
            throw new common_1.NotFoundException('Blog category not found');
        return this.prisma.blogCategory.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                ...(data.name && { slug: this.slug(data.name) })
            }
        });
    }
    async removeBlogCategory(id) {
        const cat = await this.prisma.blogCategory.findUnique({ where: { id } });
        if (!cat)
            throw new common_1.NotFoundException('Blog category not found');
        return this.prisma.blogCategory.delete({ where: { id } });
    }
    findMediaCategories() {
        return this.prisma.mediaCategory.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { media: true } } }
        });
    }
    createMediaCategory(data) {
        return this.prisma.mediaCategory.create({ data: { name: data.name, slug: this.slug(data.name) } });
    }
    async removeMediaCategory(id) {
        return this.prisma.mediaCategory.delete({ where: { id } });
    }
    findReportCategories() {
        return this.prisma.reportCategory.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { reports: true } } }
        });
    }
    createReportCategory(data) {
        return this.prisma.reportCategory.create({ data: { name: data.name, slug: this.slug(data.name) } });
    }
    async removeReportCategory(id) {
        return this.prisma.reportCategory.delete({ where: { id } });
    }
    findFaqCategories() {
        return this.prisma.faqCategory.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { faqs: true } } }
        });
    }
    createFaqCategory(data) {
        return this.prisma.faqCategory.create({ data: { name: data.name, slug: this.slug(data.name) } });
    }
    async removeFaqCategory(id) {
        return this.prisma.faqCategory.delete({ where: { id } });
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map