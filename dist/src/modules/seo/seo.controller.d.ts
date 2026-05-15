import { SeoService } from './seo.service';
export declare class SeoController {
    private readonly seoService;
    constructor(seoService: SeoService);
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
    findOne(entityType: string, entityId: string): Promise<{
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
    upsert(entityType: string, entityId: string, body: {
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
    remove(entityType: string, entityId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
