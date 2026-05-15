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
exports.PartnersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PartnersService = class PartnersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(dto) { return this.prisma.partner.create({ data: dto }); }
    findAll(activeOnly = false) {
        return this.prisma.partner.findMany({
            where: activeOnly ? { isActive: true } : {},
            orderBy: { order: 'asc' },
        });
    }
    async findOne(id) {
        const p = await this.prisma.partner.findUnique({ where: { id } });
        if (!p)
            throw new common_1.NotFoundException('Partner not found');
        return p;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.partner.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.partner.delete({ where: { id } });
    }
    async reorder(ids) {
        const updates = ids.map((id, index) => this.prisma.partner.update({ where: { id }, data: { order: index } }));
        return Promise.all(updates);
    }
};
exports.PartnersService = PartnersService;
exports.PartnersService = PartnersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PartnersService);
//# sourceMappingURL=partners.service.js.map