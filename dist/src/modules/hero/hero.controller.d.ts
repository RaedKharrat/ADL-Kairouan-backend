import { HeroService } from './hero.service';
export declare class HeroController {
    private readonly heroService;
    constructor(heroService: HeroService);
    getActive(): import(".prisma/client").Prisma.PrismaPromise<{
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
    create(body: {
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
    update(id: string, body: any): Promise<{
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
