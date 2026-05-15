import { StatisticsService } from './statistics.service';
export declare class StatisticsController {
    private readonly statisticsService;
    constructor(statisticsService: StatisticsService);
    getActive(): import(".prisma/client").Prisma.PrismaPromise<{
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
    create(body: {
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
    update(id: string, body: any): Promise<{
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
