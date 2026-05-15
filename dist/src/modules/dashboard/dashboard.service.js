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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSummary() {
        const [totalProjects, publishedProjects, totalBlogPosts, publishedBlogPosts, totalPartners, totalMediaItems, totalReports, totalFaqs, totalTestimonials, unreadMessages, totalMessages, totalSubscribers, activeSubscribers,] = await Promise.all([
            this.prisma.project.count({ where: { deletedAt: null } }),
            this.prisma.project.count({ where: { status: client_1.PublishStatus.PUBLISHED, deletedAt: null } }),
            this.prisma.blogPost.count({ where: { deletedAt: null } }),
            this.prisma.blogPost.count({ where: { status: client_1.PublishStatus.PUBLISHED, deletedAt: null } }),
            this.prisma.partner.count({ where: { isActive: true } }),
            this.prisma.mediaItem.count(),
            this.prisma.report.count({ where: { published: true } }),
            this.prisma.fAQ.count({ where: { isActive: true } }),
            this.prisma.testimonial.count({ where: { isActive: true } }),
            this.prisma.contactMessage.count({ where: { isRead: false, isArchived: false } }),
            this.prisma.contactMessage.count({ where: { isArchived: false } }),
            this.prisma.newsletterSubscriber.count(),
            this.prisma.newsletterSubscriber.count({ where: { isActive: true } }),
        ]);
        return {
            projects: { total: totalProjects, published: publishedProjects, draft: totalProjects - publishedProjects },
            blog: { total: totalBlogPosts, published: publishedBlogPosts, draft: totalBlogPosts - publishedBlogPosts },
            partners: totalPartners,
            media: totalMediaItems,
            reports: totalReports,
            faqs: totalFaqs,
            testimonials: totalTestimonials,
            messages: { total: totalMessages, unread: unreadMessages },
            newsletter: { total: totalSubscribers, active: activeSubscribers },
        };
    }
    async getRecentActivity(limit = 20) {
        return this.prisma.auditLog.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
        });
    }
    async getRecentMessages(limit = 5) {
        return this.prisma.contactMessage.findMany({
            where: { isArchived: false },
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getTopProjects(limit = 5) {
        return this.prisma.project.findMany({
            where: { status: client_1.PublishStatus.PUBLISHED, deletedAt: null },
            orderBy: { views: 'desc' },
            take: limit,
            select: { id: true, title: true, slug: true, views: true, coverImage: true },
        });
    }
    async getTopBlogPosts(limit = 5) {
        return this.prisma.blogPost.findMany({
            where: { status: client_1.PublishStatus.PUBLISHED, deletedAt: null },
            orderBy: { views: 'desc' },
            take: limit,
            select: { id: true, title: true, slug: true, views: true, coverImage: true, publishedAt: true },
        });
    }
    async getMonthlyStats() {
        const months = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({ year: d.getFullYear(), month: d.getMonth() + 1, label: d.toLocaleString('default', { month: 'short', year: '2-digit' }) });
        }
        return months;
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map