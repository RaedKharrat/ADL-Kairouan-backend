import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly usersService;
    private readonly jwtService;
    private readonly config;
    constructor(prisma: PrismaService, usersService: UsersService, jwtService: JwtService, config: ConfigService);
    login(dto: LoginDto, ip?: string, userAgent?: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string | null;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            lastLogin: Date | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    private generateTokens;
    private sanitizeUser;
}
