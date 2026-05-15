import { PrismaService } from '../../prisma/prisma.service';
export declare class SeoService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    upsert(entityType: string, entityId: string, data: {
        title?: string;
        description?: string;
        keywords?: string[];
        ogImage?: string;
        canonical?: string;
        noIndex?: boolean;
        noFollow?: boolean;
    }): Promise<{
        id: string;
        updatedAt: Date;
        description: string | null;
        title: string | null;
        ogImage: string | null;
        entityId: string;
        entityType: string;
        keywords: string[];
        canonical: string | null;
        noIndex: boolean;
        noFollow: boolean;
    }>;
    findByEntity(entityType: string, entityId: string): Promise<{
        id: string;
        updatedAt: Date;
        description: string | null;
        title: string | null;
        ogImage: string | null;
        entityId: string;
        entityType: string;
        keywords: string[];
        canonical: string | null;
        noIndex: boolean;
        noFollow: boolean;
    } | null>;
    findAll(entityType?: string): Promise<{
        id: string;
        updatedAt: Date;
        description: string | null;
        title: string | null;
        ogImage: string | null;
        entityId: string;
        entityType: string;
        keywords: string[];
        canonical: string | null;
        noIndex: boolean;
        noFollow: boolean;
    }[]>;
    remove(entityType: string, entityId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
