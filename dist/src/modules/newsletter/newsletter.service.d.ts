import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class NewsletterService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    subscribe(email: string, name?: string, ip?: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        ip: string | null;
    }>;
    unsubscribe(email: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        ip: string | null;
    }>;
    findAll(query: PaginationDto): Promise<import("../../common/dto/pagination.dto").PaginatedResult<{
        id: string;
        email: string;
        name: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        ip: string | null;
    }>>;
    remove(id: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        ip: string | null;
    }>;
    getStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
    }>;
}
