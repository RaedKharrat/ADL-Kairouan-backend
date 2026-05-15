import { PrismaService } from '../../prisma/prisma.service';
import { SettingGroup } from '@prisma/client';
export declare class SettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(group?: SettingGroup): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string | null;
        type: import(".prisma/client").$Enums.SettingType;
        group: import(".prisma/client").$Enums.SettingGroup;
        label: string | null;
    }[]>;
    findByKey(key: string): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string | null;
        type: import(".prisma/client").$Enums.SettingType;
        group: import(".prisma/client").$Enums.SettingGroup;
        label: string | null;
    } | null>;
    upsert(key: string, value: string, group?: SettingGroup, label?: string): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string | null;
        type: import(".prisma/client").$Enums.SettingType;
        group: import(".prisma/client").$Enums.SettingGroup;
        label: string | null;
    }>;
    upsertMany(settings: {
        key: string;
        value: string;
        group?: SettingGroup;
        label?: string;
    }[]): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string | null;
        type: import(".prisma/client").$Enums.SettingType;
        group: import(".prisma/client").$Enums.SettingGroup;
        label: string | null;
    }[]>;
    remove(key: string): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string | null;
        type: import(".prisma/client").$Enums.SettingType;
        group: import(".prisma/client").$Enums.SettingGroup;
        label: string | null;
    }>;
    getPublicSettings(): Promise<Record<string, string>>;
}
