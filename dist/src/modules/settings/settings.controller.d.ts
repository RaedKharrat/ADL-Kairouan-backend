import { SettingsService } from './settings.service';
import { SettingGroup } from '@prisma/client';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getPublic(): Promise<Record<string, string>>;
    findAll(group?: SettingGroup): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string | null;
        type: import(".prisma/client").$Enums.SettingType;
        group: import(".prisma/client").$Enums.SettingGroup;
        label: string | null;
    }[]>;
    upsert(body: {
        key: string;
        value: string;
        group?: SettingGroup;
        label?: string;
    }): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string | null;
        type: import(".prisma/client").$Enums.SettingType;
        group: import(".prisma/client").$Enums.SettingGroup;
        label: string | null;
    }>;
    upsertMany(body: {
        settings: {
            key: string;
            value: string;
            group?: SettingGroup;
            label?: string;
        }[];
    }): Promise<{
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
}
