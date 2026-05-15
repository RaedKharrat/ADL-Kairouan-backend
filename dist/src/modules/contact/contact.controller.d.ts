import { Request } from 'express';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    submit(dto: CreateContactMessageDto, req: Request): Promise<{
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
    findAll(query: PaginationDto): Promise<import("../../common/dto/pagination.dto").PaginatedResult<{
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
    getStats(): Promise<{
        total: number;
        unread: number;
    }>;
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
}
