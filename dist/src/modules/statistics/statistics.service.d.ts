import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
export declare class StatisticsService {
    private readonly prisma;
    private readonly cache;
    constructor(prisma: PrismaService, cache: CacheService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        label: string;
        order: number;
        icon: string | null;
        suffix: string | null;
    }[]>;
    findActive(): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        label: string;
        order: number;
        icon: string | null;
        suffix: string | null;
    }[]>;
    create(data: {
        label: string;
        value: string;
        icon?: string;
        suffix?: string;
        order?: number;
    }): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        label: string;
        order: number;
        icon: string | null;
        suffix: string | null;
    }>;
    update(id: string, data: Partial<{
        label: string;
        value: string;
        icon: string;
        suffix: string;
        order: number;
        isActive: boolean;
    }>): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        label: string;
        order: number;
        icon: string | null;
        suffix: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        label: string;
        order: number;
        icon: string | null;
        suffix: string | null;
    }>;
}
