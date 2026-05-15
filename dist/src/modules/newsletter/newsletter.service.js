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
exports.NewsletterService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let NewsletterService = class NewsletterService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async subscribe(email, name, ip) {
        const existing = await this.prisma.newsletterSubscriber.findUnique({ where: { email } });
        if (existing) {
            if (existing.isActive)
                throw new common_1.ConflictException('Already subscribed');
            return this.prisma.newsletterSubscriber.update({ where: { email }, data: { isActive: true, name } });
        }
        return this.prisma.newsletterSubscriber.create({ data: { email, name, ip } });
    }
    async unsubscribe(email) {
        const sub = await this.prisma.newsletterSubscriber.findUnique({ where: { email } });
        if (!sub)
            throw new common_1.NotFoundException('Subscriber not found');
        return this.prisma.newsletterSubscriber.update({ where: { email }, data: { isActive: false } });
    }
    async findAll(query) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;
        const where = {
            ...(search && { OR: [{ email: { contains: search, mode: 'insensitive' } }, { name: { contains: search, mode: 'insensitive' } }] }),
        };
        const [items, total] = await Promise.all([
            this.prisma.newsletterSubscriber.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            this.prisma.newsletterSubscriber.count({ where }),
        ]);
        return (0, pagination_dto_1.paginate)(items, total, page, limit);
    }
    async remove(id) {
        return this.prisma.newsletterSubscriber.delete({ where: { id } });
    }
    async getStats() {
        const [total, active] = await Promise.all([
            this.prisma.newsletterSubscriber.count(),
            this.prisma.newsletterSubscriber.count({ where: { isActive: true } }),
        ]);
        return { total, active, inactive: total - active };
    }
};
exports.NewsletterService = NewsletterService;
exports.NewsletterService = NewsletterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NewsletterService);
//# sourceMappingURL=newsletter.service.js.map