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
exports.SeoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SeoService = class SeoService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async upsert(entityType, entityId, data) {
        return this.prisma.seoMetadata.upsert({
            where: { entityType_entityId: { entityType, entityId } },
            update: data,
            create: { entityType, entityId, ...data },
        });
    }
    async findByEntity(entityType, entityId) {
        return this.prisma.seoMetadata.findUnique({
            where: { entityType_entityId: { entityType, entityId } },
        });
    }
    async findAll(entityType) {
        return this.prisma.seoMetadata.findMany({
            where: entityType ? { entityType } : {},
            orderBy: { updatedAt: 'desc' },
        });
    }
    async remove(entityType, entityId) {
        return this.prisma.seoMetadata.deleteMany({
            where: { entityType, entityId },
        });
    }
};
exports.SeoService = SeoService;
exports.SeoService = SeoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeoService);
//# sourceMappingURL=seo.service.js.map