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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SearchService = class SearchService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async globalSearch(query, limit = 10) {
        if (!query || query.trim().length < 2)
            return { projects: [], blogPosts: [], reports: [] };
        const searchTerm = query.trim();
        const ilike = (field) => ({ contains: searchTerm, mode: 'insensitive' });
        const [projects, blogPosts, reports] = await Promise.all([
            this.prisma.project.findMany({
                where: {
                    deletedAt: null,
                    status: 'PUBLISHED',
                    OR: [{ title: ilike('title') }, { excerpt: ilike('excerpt') }],
                },
                take: limit,
                select: { id: true, title: true, slug: true, coverImage: true, excerpt: true, category: { select: { name: true } } },
            }),
            this.prisma.blogPost.findMany({
                where: {
                    deletedAt: null,
                    status: 'PUBLISHED',
                    OR: [{ title: ilike('title') }, { excerpt: ilike('excerpt') }],
                },
                take: limit,
                select: { id: true, title: true, slug: true, coverImage: true, excerpt: true, publishedAt: true, category: { select: { name: true } } },
            }),
            this.prisma.report.findMany({
                where: {
                    published: true,
                    OR: [{ title: ilike('title') }, { description: ilike('description') }],
                },
                take: limit,
                select: { id: true, title: true, description: true, fileUrl: true, year: true },
            }),
        ]);
        return { projects, blogPosts, reports };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map