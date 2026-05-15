import { PrismaService } from '../../prisma/prisma.service';
export declare class HeroService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        title: string;
        image: string;
        subtitle: string | null;
        ctaText: string | null;
        ctaLink: string | null;
    }[]>;
    findActive(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        title: string;
        image: string;
        subtitle: string | null;
        ctaText: string | null;
        ctaLink: string | null;
    }[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__HeroSlideClient<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        title: string;
        image: string;
        subtitle: string | null;
        ctaText: string | null;
        ctaLink: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    create(data: {
        title: string;
        subtitle?: string;
        ctaText?: string;
        ctaLink?: string;
        image: string;
        order?: number;
    }): import(".prisma/client").Prisma.Prisma__HeroSlideClient<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        title: string;
        image: string;
        subtitle: string | null;
        ctaText: string | null;
        ctaLink: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: Partial<{
        title: string;
        subtitle: string;
        ctaText: string;
        ctaLink: string;
        image: string;
        order: number;
        isActive: boolean;
    }>): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        title: string;
        image: string;
        subtitle: string | null;
        ctaText: string | null;
        ctaLink: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        title: string;
        image: string;
        subtitle: string | null;
        ctaText: string | null;
        ctaLink: string | null;
    }>;
}
