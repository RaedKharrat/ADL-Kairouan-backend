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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateReportDto {
}
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
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(dto) {
        const { title, description, fileUrl, fileType, fileSize, year, published, featured, categoryId } = dto;
        return this.prisma.report.create({
            data: {
                title,
                description,
                fileUrl,
                fileType,
                fileSize,
                year,
                published,
                featured,
                categoryId: categoryId || undefined
            },
            include: { category: true }
        });
    }
    async findAll(query) {
        const { page = 1, limit = 10, search, year, published, categoryId } = query;
        const skip = (page - 1) * limit;
        const where = {
            ...(year && { year }),
            ...(published !== undefined && { published }),
            ...(categoryId && { categoryId }),
            ...(search && { OR: [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] }),
        };
        const [items, total] = await Promise.all([
            this.prisma.report.findMany({ where, skip, take: limit, include: { category: true }, orderBy: [{ year: 'desc' }, { createdAt: 'desc' }] }),
            this.prisma.report.count({ where }),
        ]);
        return (0, pagination_dto_1.paginate)(items, total, page, limit);
    }
    async findPublished(query) {
        return this.findAll({ ...query, published: true });
    }
    async findOne(id) {
        const r = await this.prisma.report.findUnique({ where: { id }, include: { category: true } });
        if (!r)
            throw new common_1.NotFoundException('Report not found');
        return r;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.report.update({ where: { id }, data: dto, include: { category: true } });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.report.delete({ where: { id } });
    }
    async incrementDownload(id) {
        return this.prisma.report.update({ where: { id }, data: { downloads: { increment: 1 } } });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map