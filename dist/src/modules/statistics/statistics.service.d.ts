import { PrismaService } from '../../prisma/prisma.service';
export declare class StatisticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    findActive(): import(".prisma/client").Prisma.PrismaPromise<{
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
    }): import(".prisma/client").Prisma.Prisma__StatisticClient<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        label: string;
        order: number;
        icon: string | null;
        suffix: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
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
