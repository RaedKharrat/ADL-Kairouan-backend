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
exports.HeroService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
let HeroService = class HeroService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    findAll() {
        return this.prisma.heroSlide.findMany({ orderBy: { order: 'asc' } });
    }
    async findActive() {
        return this.cache.wrap('hero:active', () => {
            return this.prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });
        }, 600);
    }
    findOne(id) {
        return this.prisma.heroSlide.findUnique({ where: { id } });
    }
    async create(data) {
        const slide = await this.prisma.heroSlide.create({ data });
        await this.cache.del('hero:active');
        return slide;
    }
    async update(id, data) {
        const slide = await this.prisma.heroSlide.findUnique({ where: { id } });
        if (!slide)
            throw new common_1.NotFoundException('Hero slide not found');
        const updated = await this.prisma.heroSlide.update({ where: { id }, data });
        await this.cache.del('hero:active');
        return updated;
    }
    async remove(id) {
        const slide = await this.prisma.heroSlide.findUnique({ where: { id } });
        if (!slide)
            throw new common_1.NotFoundException('Hero slide not found');
        const deleted = await this.prisma.heroSlide.delete({ where: { id } });
        await this.cache.del('hero:active');
        return deleted;
    }
};
exports.HeroService = HeroService;
exports.HeroService = HeroService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], HeroService);
//# sourceMappingURL=hero.service.js.map