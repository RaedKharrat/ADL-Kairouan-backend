import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ReorderItemDto } from '../../common/dto/reorder.dto';
export declare class CreateReportDto {
    title: string;
    description?: string;
    fileUrl: string;
    fileType?: string;
    fileSize?: number;
    year?: number;
    published?: boolean;
    featured?: boolean;
    categoryId?: string;
    order?: number;
}
export declare class ReportsService {
    private readonly prisma;
    private readonly cache;
    constructor(prisma: PrismaService, cache: CacheService);
    private invalidateCache;
    create(dto: CreateReportDto): Promise<{
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
        description: string | null;
        order: number;
        title: string;
        featured: boolean;
        categoryId: string | null;
        fileUrl: string;
        fileType: string | null;
        fileSize: number | null;
        year: number | null;
        published: boolean;
        downloads: number;
    }>;
    findAll(query: PaginationDto & {
        year?: number;
        published?: boolean;
        categoryId?: string;
    }): Promise<import("../../common/dto/pagination.dto").PaginatedResult<{
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
        description: string | null;
        order: number;
        title: string;
        featured: boolean;
        categoryId: string | null;
        fileUrl: string;
        fileType: string | null;
        fileSize: number | null;
        year: number | null;
        published: boolean;
        downloads: number;
    }>>;
    findPublished(query: PaginationDto & {
        year?: number;
        categoryId?: string;
    }): Promise<import("../../common/dto/pagination.dto").PaginatedResult<{
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
        description: string | null;
        order: number;
        title: string;
        featured: boolean;
        categoryId: string | null;
        fileUrl: string;
        fileType: string | null;
        fileSize: number | null;
        year: number | null;
        published: boolean;
        downloads: number;
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
        description: string | null;
        order: number;
        title: string;
        featured: boolean;
        categoryId: string | null;
        fileUrl: string;
        fileType: string | null;
        fileSize: number | null;
        year: number | null;
        published: boolean;
        downloads: number;
    }>;
    update(id: string, dto: Partial<CreateReportDto>): Promise<{
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
        description: string | null;
        order: number;
        title: string;
        featured: boolean;
        categoryId: string | null;
        fileUrl: string;
        fileType: string | null;
        fileSize: number | null;
        year: number | null;
        published: boolean;
        downloads: number;
    }>;
    reorder(items: ReorderItemDto[]): Promise<{
        success: boolean;
        count: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        title: string;
        featured: boolean;
        categoryId: string | null;
        fileUrl: string;
        fileType: string | null;
        fileSize: number | null;
        year: number | null;
        published: boolean;
        downloads: number;
    }>;
    incrementDownload(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        title: string;
        featured: boolean;
        categoryId: string | null;
        fileUrl: string;
        fileType: string | null;
        fileSize: number | null;
        year: number | null;
        published: boolean;
        downloads: number;
    }>;
}
