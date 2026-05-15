import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class ContactService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateContactMessageDto, ip?: string, userAgent?: string): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        ip: string | null;
        userAgent: string | null;
        phone: string | null;
        subject: string | null;
        isRead: boolean;
        isArchived: boolean;
    }>;
    findAll(query: PaginationDto & {
        isRead?: boolean;
        isArchived?: boolean;
    }): Promise<import("../../common/dto/pagination.dto").PaginatedResult<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        ip: string | null;
        userAgent: string | null;
        phone: string | null;
        subject: string | null;
        isRead: boolean;
        isArchived: boolean;
    }>>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        ip: string | null;
        userAgent: string | null;
        phone: string | null;
        subject: string | null;
        isRead: boolean;
        isArchived: boolean;
    }>;
    markRead(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        ip: string | null;
        userAgent: string | null;
        phone: string | null;
        subject: string | null;
        isRead: boolean;
        isArchived: boolean;
    }>;
    archive(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        ip: string | null;
        userAgent: string | null;
        phone: string | null;
        subject: string | null;
        isRead: boolean;
        isArchived: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        ip: string | null;
        userAgent: string | null;
        phone: string | null;
        subject: string | null;
        isRead: boolean;
        isArchived: boolean;
    }>;
    getStats(): Promise<{
        total: number;
        unread: number;
    }>;
}
