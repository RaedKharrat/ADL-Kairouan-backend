import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto, req: Request, res: Response): Promise<{
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
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
    }>;
    refresh(req: Request, res: Response): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, res: Response): Promise<{
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
}
