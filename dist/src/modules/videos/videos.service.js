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
exports.VideosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let VideosService = class VideosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(dto) {
        return this.prisma.video.create({ data: dto });
    }
    async findAll(query) {
        const { page = 1, limit = 12, search, featured } = query;
        const skip = (page - 1) * limit;
        const where = {
            ...(featured !== undefined && { featured }),
            ...(search && { OR: [{ title: { contains: search, mode: 'insensitive' } }] }),
        };
        const [items, total] = await Promise.all([
            this.prisma.video.findMany({ where, skip, take: limit, orderBy: { order: 'asc' } }),
            this.prisma.video.count({ where }),
        ]);
        return (0, pagination_dto_1.paginate)(items, total, page, limit);
    }
    async findOne(id) {
        const v = await this.prisma.video.findUnique({ where: { id } });
        if (!v)
            throw new common_1.NotFoundException('Video not found');
        return v;
    }
    async update(id, dto) { await this.findOne(id); return this.prisma.video.update({ where: { id }, data: dto }); }
    async remove(id) { await this.findOne(id); return this.prisma.video.delete({ where: { id } }); }
    getFeatured(limit = 6) { return this.prisma.video.findMany({ where: { featured: true, isActive: true }, take: limit, orderBy: { order: 'asc' } }); }
};
exports.VideosService = VideosService;
exports.VideosService = VideosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VideosService);
//# sourceMappingURL=videos.service.js.map