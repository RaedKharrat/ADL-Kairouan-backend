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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, createdBy) {
        if (dto.role === client_1.Role.SUPER_ADMIN && createdBy.role !== client_1.Role.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Only Super Admin can create Super Admin accounts');
        }
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        const hashed = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: { ...dto, password: hashed },
            select: { id: true, email: true, name: true, role: true, avatar: true, isActive: true, createdAt: true },
        });
        return user;
    }
    async findAll(query) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: { id: true, email: true, name: true, role: true, avatar: true, isActive: true, lastLogin: true, createdAt: true },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        return (0, pagination_dto_1.paginate)(users, total, page, limit);
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id, deletedAt: null },
            select: { id: true, email: true, name: true, role: true, avatar: true, isActive: true, lastLogin: true, createdAt: true, updatedAt: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async update(id, dto, updatedBy) {
        const user = await this.prisma.user.findUnique({ where: { id, deletedAt: null } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (dto.role === client_1.Role.SUPER_ADMIN && updatedBy.role !== client_1.Role.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Only Super Admin can assign Super Admin role');
        }
        const data = { ...dto };
        if (dto.password) {
            data.password = await bcrypt.hash(dto.password, 12);
        }
        return this.prisma.user.update({
            where: { id },
            data,
            select: { id: true, email: true, name: true, role: true, avatar: true, isActive: true, updatedAt: true },
        });
    }
    async remove(id, deletedBy) {
        if (id === deletedBy.id)
            throw new common_1.ForbiddenException('Cannot delete your own account');
        const user = await this.prisma.user.findUnique({ where: { id, deletedAt: null } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() },
            select: { id: true },
        });
    }
    async toggleActive(id) {
        const user = await this.prisma.user.findUnique({ where: { id, deletedAt: null } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive },
            select: { id: true, isActive: true },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map