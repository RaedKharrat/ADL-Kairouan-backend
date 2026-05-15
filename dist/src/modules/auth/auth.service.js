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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(prisma, usersService, jwtService, config) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.config = config;
    }
    async login(dto, ip, userAgent) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email, deletedAt: null },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (!user.isActive) {
            throw new common_1.ForbiddenException('Account is deactivated. Contact administrator.');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        await this.prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'LOGIN',
                entity: 'User',
                entityId: user.id,
                ip,
                userAgent,
            },
        });
        const tokens = await this.generateTokens(user);
        return {
            ...tokens,
            user: this.sanitizeUser(user),
        };
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token required');
        }
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.config.get('auth.refreshSecret'),
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub, deletedAt: null },
            });
            if (!user || !user.isActive) {
                throw new common_1.UnauthorizedException('User not found or inactive');
            }
            return this.generateTokens(user);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async logout(userId) {
        await this.prisma.auditLog.create({
            data: {
                userId,
                action: 'LOGOUT',
                entity: 'User',
                entityId: userId,
            },
        });
        return { message: 'Logged out successfully' };
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId, deletedAt: null },
        });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        return this.sanitizeUser(user);
    }
    async generateTokens(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.get('auth.jwtSecret'),
                expiresIn: this.config.get('auth.jwtExpiresIn'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.config.get('auth.refreshSecret'),
                expiresIn: this.config.get('auth.refreshExpiresIn'),
            }),
        ]);
        return { accessToken, refreshToken };
    }
    sanitizeUser(user) {
        const { password, ...sanitized } = user;
        return sanitized;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map