import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto, createdBy: {
        role: Role;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
    }>;
    findAll(query: PaginationDto): Promise<import("../../common/dto/pagination.dto").PaginatedResult<{
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
    }>>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto, updatedBy: {
        role: Role;
        id: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        updatedAt: Date;
    }>;
    remove(id: string, deletedBy: {
        id: string;
    }): Promise<{
        id: string;
    }>;
    toggleActive(id: string): Promise<{
        id: string;
        isActive: boolean;
    }>;
}
