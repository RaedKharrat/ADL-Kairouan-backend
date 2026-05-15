import { MediaService } from './media.service';
import { MediaType } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    findPublic(query: PaginationDto & {
        type?: MediaType;
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
    findCategories(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }[]>;
    findAll(query: PaginationDto): Promise<import("../../common/dto/pagination.dto").PaginatedResult<{
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
    update(id: string, dto: any): Promise<{
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
    bulkDelete(body: {
        ids: string[];
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
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
    getCategories(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }[]>;
    createCategory(dto: any): import(".prisma/client").Prisma.Prisma__MediaCategoryClient<{
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
