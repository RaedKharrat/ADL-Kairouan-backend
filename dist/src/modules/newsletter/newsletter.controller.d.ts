import { Request } from 'express';
import { NewsletterService } from './newsletter.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
declare class SubscribeDto {
    email: string;
    name?: string;
}
export declare class NewsletterController {
    private readonly newsletterService;
    constructor(newsletterService: NewsletterService);
    subscribe(dto: SubscribeDto, req: Request): Promise<{
        id: string;
        email: string;
        name: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        ip: string | null;
    }>;
    unsubscribe(body: {
        email: string;
    }): Promise<{
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
    getStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        ip: string | null;
    }>;
}
export {};
