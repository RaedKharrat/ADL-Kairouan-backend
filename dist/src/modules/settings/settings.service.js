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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
const client_1 = require("@prisma/client");
let SettingsService = class SettingsService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    findAll(group) {
        return this.prisma.siteSetting.findMany({ where: group ? { group } : {}, orderBy: { group: 'asc' } });
    }
    async findByKey(key) {
        return this.prisma.siteSetting.findUnique({ where: { key } });
    }
    async upsert(key, value, group, label) {
        const result = await this.prisma.siteSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value, group: group || client_1.SettingGroup.GENERAL, label },
        });
        await this.cache.del('settings:public');
        return result;
    }
    async upsertMany(settings) {
        const result = await Promise.all(settings.map((s) => this.upsert(s.key, s.value, s.group, s.label)));
        await this.cache.del('settings:public');
        return result;
    }
    async remove(key) {
        const result = await this.prisma.siteSetting.delete({ where: { key } });
        await this.cache.del('settings:public');
        return result;
    }
    async getPublicSettings() {
        return this.cache.wrap('settings:public', async () => {
            const settings = await this.prisma.siteSetting.findMany({
                where: { group: { in: [client_1.SettingGroup.GENERAL, client_1.SettingGroup.SOCIAL, client_1.SettingGroup.CONTACT] } },
            });
            return Object.fromEntries(settings.map((s) => [s.key, s.value ?? '']));
        }, 600);
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map