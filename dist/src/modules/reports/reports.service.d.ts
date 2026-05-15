import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
declare class CreateReportDto {
    title: string;
    description?: string;
    fileUrl: string;
    fileType?: string;
    fileSize?: number;
    year?: number;
    published?: boolean;
    featured?: boolean;
    categoryId?: string;
}
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateReportDto): import(".prisma/client").Prisma.Prisma__ReportClient<{
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
        title: string;
        featured: boolean;
        categoryId: string | null;
        fileUrl: string;
        fileType: string | null;
        fileSize: number | null;
        year: number | null;
        published: boolean;
        downloads: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
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
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
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
export {};
