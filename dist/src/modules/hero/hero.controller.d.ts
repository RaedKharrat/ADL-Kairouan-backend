import { HeroService } from './hero.service';
import { CreateHeroDto, UpdateHeroDto } from './dto/hero.dto';
export declare class HeroController {
    private readonly heroService;
    constructor(heroService: HeroService);
    getActive(): Promise<{
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
    create(body: CreateHeroDto): Promise<{
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
    update(id: string, body: UpdateHeroDto): Promise<{
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
