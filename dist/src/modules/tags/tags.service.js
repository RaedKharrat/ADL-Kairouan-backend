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
exports.TagsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const slugify_1 = require("slugify");
let TagsService = class TagsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    slug(name) {
        return (0, slugify_1.default)(name, { lower: true, strict: true });
    }
    findAll() {
        return this.prisma.blogTag.findMany({ orderBy: { name: 'asc' } });
    }
    findOne(id) {
        return this.prisma.blogTag.findUnique({ where: { id }, include: { _count: { select: { posts: true } } } });
    }
    create(data) {
        return this.prisma.blogTag.create({ data: { name: data.name, slug: this.slug(data.name) } });
    }
    async update(id, data) {
        const tag = await this.prisma.blogTag.findUnique({ where: { id } });
        if (!tag)
            throw new common_1.NotFoundException('Tag not found');
        return this.prisma.blogTag.update({ where: { id }, data: { name: data.name, slug: this.slug(data.name) } });
    }
    async remove(id) {
        const tag = await this.prisma.blogTag.findUnique({ where: { id } });
        if (!tag)
            throw new common_1.NotFoundException('Tag not found');
        return this.prisma.blogTag.delete({ where: { id } });
    }
};
exports.TagsService = TagsService;
exports.TagsService = TagsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TagsService);
//# sourceMappingURL=tags.service.js.map