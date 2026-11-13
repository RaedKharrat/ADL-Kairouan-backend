import { ReportsService, CreateReportDto } from './reports.service';
import { ReorderDto } from '../../common/dto/reorder.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    findPublished(query: PaginationDto): Promise<import("../../common/dto/pagination.dto").PaginatedResult<{
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
    download(id: string): Promise<{
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
    findAll(query: PaginationDto): Promise<import("../../common/dto/pagination.dto").PaginatedResult<{
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
    reorder(dto: ReorderDto): Promise<{
        success: boolean;
        count: number;
    }>;
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
}
