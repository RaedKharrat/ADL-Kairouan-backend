import { StatisticsService } from './statistics.service';
import { CreateStatisticDto, UpdateStatisticDto } from './dto/statistic.dto';
export declare class StatisticsController {
    private readonly statisticsService;
    constructor(statisticsService: StatisticsService);
    getActive(): Promise<{
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
    create(body: CreateStatisticDto): Promise<{
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
    update(id: string, body: UpdateStatisticDto): Promise<{
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
