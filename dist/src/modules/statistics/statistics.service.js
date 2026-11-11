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
exports.StatisticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
let StatisticsService = class StatisticsService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    findAll() {
        return this.prisma.statistic.findMany({ orderBy: { order: 'asc' } });
    }
    async findActive() {
        return this.cache.wrap('statistics:active', () => {
            return this.prisma.statistic.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });
        }, 600);
    }
    async create(data) {
        const stat = await this.prisma.statistic.create({ data });
        await this.cache.del('statistics:active');
        return stat;
    }
    async update(id, data) {
        const stat = await this.prisma.statistic.findUnique({ where: { id } });
        if (!stat)
            throw new common_1.NotFoundException('Statistic not found');
        const updated = await this.prisma.statistic.update({ where: { id }, data });
        await this.cache.del('statistics:active');
        return updated;
    }
    async remove(id) {
        const stat = await this.prisma.statistic.findUnique({ where: { id } });
        if (!stat)
            throw new common_1.NotFoundException('Statistic not found');
        const deleted = await this.prisma.statistic.delete({ where: { id } });
        await this.cache.del('statistics:active');
        return deleted;
    }
};
exports.StatisticsService = StatisticsService;
exports.StatisticsService = StatisticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], StatisticsService);
//# sourceMappingURL=statistics.service.js.map