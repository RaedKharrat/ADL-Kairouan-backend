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
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let MediaService = class MediaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page = 1, limit = 20, search, type, categoryId, featured } = query;
        const skip = (page - 1) * limit;
        const where = {
            ...(type && { type }),
            ...(categoryId && { categoryId }),
            ...(featured !== undefined && { featured }),
            ...(search && { OR: [{ filename: { contains: search, mode: 'insensitive' } }, { alt: { contains: search, mode: 'insensitive' } }] }),
        };
        const [items, total] = await Promise.all([
            this.prisma.mediaItem.findMany({ where, skip, take: limit, include: { category: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } }),
            this.prisma.mediaItem.count({ where }),
        ]);
        return (0, pagination_dto_1.paginate)(items, total, page, limit);
    }
    async findOne(id) {
        const m = await this.prisma.mediaItem.findUnique({ where: { id }, include: { category: true } });
        if (!m)
            throw new common_1.NotFoundException('Media item not found');
        return m;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.mediaItem.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.mediaItem.delete({ where: { id } });
    }
    async bulkDelete(ids) {
        return this.prisma.mediaItem.deleteMany({ where: { id: { in: ids } } });
    }
    findAllCategories() { return this.prisma.mediaCategory.findMany({ orderBy: { name: 'asc' } }); }
    createCategory(dto) { return this.prisma.mediaCategory.create({ data: dto }); }
    deleteCategory(id) { return this.prisma.mediaCategory.delete({ where: { id } }); }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MediaService);
//# sourceMappingURL=media.service.js.map