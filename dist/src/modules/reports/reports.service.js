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
exports.ReportsService = exports.CreateReportDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateReportDto {
}
exports.CreateReportDto = CreateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "fileUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "fileType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateReportDto.prototype, "fileSize", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateReportDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateReportDto.prototype, "published", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateReportDto.prototype, "featured", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateReportDto.prototype, "order", void 0);
let ReportsService = class ReportsService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async invalidateCache() {
        await this.cache.delByPrefix('reports:public');
    }
    async create(dto) {
        const { title, description, fileUrl, fileType, fileSize, year, published, featured, categoryId } = dto;
        let order = dto.order;
        if (order === undefined || order === null) {
            const highest = await this.prisma.report.findFirst({
                orderBy: { order: 'desc' },
                select: { order: true },
            });
            order = (highest?.order ?? -1) + 1;
        }
        const report = await this.prisma.report.create({
            data: {
                title,
                description,
                fileUrl,
                fileType,
                fileSize,
                year,
                published,
                featured,
                order,
                categoryId: categoryId || undefined,
            },
            include: { category: true },
        });
        await this.invalidateCache();
        return report;
    }
    async findAll(query) {
        const { page = 1, limit = 10, search, year, published, categoryId, sortBy = 'order', sortOrder = 'asc' } = query;
        const skip = (page - 1) * limit;
        const where = {
            ...(year && { year }),
            ...(published !== undefined && { published }),
            ...(categoryId && { categoryId }),
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const orderBy = sortBy === 'order'
            ? [{ order: sortOrder }, { year: 'desc' }, { createdAt: 'desc' }]
            : [{ [sortBy]: sortOrder }, { order: 'asc' }];
        const [items, total] = await Promise.all([
            this.prisma.report.findMany({
                where,
                skip,
                take: limit,
                include: { category: true },
                orderBy,
            }),
            this.prisma.report.count({ where }),
        ]);
        return (0, pagination_dto_1.paginate)(items, total, page, limit);
    }
    async findPublished(query) {
        const cacheKey = `reports:public:${JSON.stringify(query)}`;
        return this.cache.wrap(cacheKey, async () => {
            return this.findAll({ ...query, published: true, sortBy: 'order', sortOrder: 'asc' });
        }, 300);
    }
    async findOne(id) {
        const r = await this.prisma.report.findUnique({ where: { id }, include: { category: true } });
        if (!r)
            throw new common_1.NotFoundException('Report not found');
        return r;
    }
    async update(id, dto) {
        await this.findOne(id);
        const updated = await this.prisma.report.update({
            where: { id },
            data: {
                ...dto,
                categoryId: dto.categoryId || undefined,
            },
            include: { category: true },
        });
        await this.invalidateCache();
        return updated;
    }
    async reorder(items) {
        await this.prisma.$transaction(items.map((item) => this.prisma.report.update({
            where: { id: item.id },
            data: { order: item.order },
        })));
        await this.invalidateCache();
        return { success: true, count: items.length };
    }
    async remove(id) {
        await this.findOne(id);
        const deleted = await this.prisma.report.delete({ where: { id } });
        await this.invalidateCache();
        return deleted;
    }
    async incrementDownload(id) {
        return this.prisma.report.update({ where: { id }, data: { downloads: { increment: 1 } } });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map