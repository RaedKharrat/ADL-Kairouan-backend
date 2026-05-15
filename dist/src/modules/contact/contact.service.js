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
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let ContactService = class ContactService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, ip, userAgent) {
        return this.prisma.contactMessage.create({ data: { ...dto, ip, userAgent } });
    }
    async findAll(query) {
        const { page = 1, limit = 10, search, isRead, isArchived = false } = query;
        const skip = (page - 1) * limit;
        const where = {
            ...(isRead !== undefined && { isRead }),
            isArchived,
            ...(search && { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }, { subject: { contains: search, mode: 'insensitive' } }] }),
        };
        const [items, total] = await Promise.all([
            this.prisma.contactMessage.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            this.prisma.contactMessage.count({ where }),
        ]);
        return (0, pagination_dto_1.paginate)(items, total, page, limit);
    }
    async findOne(id) {
        const msg = await this.prisma.contactMessage.findUnique({ where: { id } });
        if (!msg)
            throw new common_1.NotFoundException('Message not found');
        if (!msg.isRead)
            await this.prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
        return msg;
    }
    async markRead(id) {
        return this.prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
    }
    async archive(id) {
        return this.prisma.contactMessage.update({ where: { id }, data: { isArchived: true } });
    }
    async remove(id) {
        const msg = await this.prisma.contactMessage.findUnique({ where: { id } });
        if (!msg)
            throw new common_1.NotFoundException('Message not found');
        return this.prisma.contactMessage.delete({ where: { id } });
    }
    async getStats() {
        const [total, unread] = await Promise.all([
            this.prisma.contactMessage.count({ where: { isArchived: false } }),
            this.prisma.contactMessage.count({ where: { isRead: false, isArchived: false } }),
        ]);
        return { total, unread };
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContactService);
//# sourceMappingURL=contact.service.js.map