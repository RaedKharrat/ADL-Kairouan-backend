import { PrismaService } from '../../prisma/prisma.service';
import { MediaType } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class MediaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: PaginationDto & {
        type?: MediaType;
        categoryId?: string;
        featured?: boolean;
    }): Promise<import("../../common/dto/pagination.dto").PaginatedResult<{
        category: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.MediaType;
        featured: boolean;
        categoryId: string | null;
        url: string;
        alt: string | null;
        filename: string;
        publicId: string | null;
        mimeType: string | null;
        size: number | null;
        width: number | null;
        height: number | null;
        caption: string | null;
    }>>;
    findOne(id: string): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.MediaType;
        featured: boolean;
        categoryId: string | null;
        url: string;
        alt: string | null;
        filename: string;
        publicId: string | null;
        mimeType: string | null;
        size: number | null;
        width: number | null;
        height: number | null;
        caption: string | null;
    }>;
    update(id: string, dto: {
        alt?: string;
        caption?: string;
        categoryId?: string;
        featured?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.MediaType;
        featured: boolean;
        categoryId: string | null;
        url: string;
        alt: string | null;
        filename: string;
        publicId: string | null;
        mimeType: string | null;
        size: number | null;
        width: number | null;
        height: number | null;
        caption: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.MediaType;
        featured: boolean;
        categoryId: string | null;
        url: string;
        alt: string | null;
        filename: string;
        publicId: string | null;
        mimeType: string | null;
        size: number | null;
        width: number | null;
        height: number | null;
        caption: string | null;
    }>;
    bulkDelete(ids: string[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
    findAllCategories(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }[]>;
    createCategory(dto: {
        name: string;
        slug: string;
    }): import(".prisma/client").Prisma.Prisma__MediaCategoryClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    deleteCategory(id: string): import(".prisma/client").Prisma.Prisma__MediaCategoryClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
