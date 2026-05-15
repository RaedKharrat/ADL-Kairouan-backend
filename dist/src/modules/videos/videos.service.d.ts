import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class VideosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: {
        title: string;
        description?: string;
        url?: string;
        youtubeId?: string;
        thumbnail?: string;
        duration?: string;
        featured?: boolean;
        order?: number;
    }): import(".prisma/client").Prisma.Prisma__VideoClient<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        title: string;
        featured: boolean;
        url: string | null;
        youtubeId: string | null;
        thumbnail: string | null;
        duration: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(query: PaginationDto & {
        featured?: boolean;
    }): Promise<import("../../common/dto/pagination.dto").PaginatedResult<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        title: string;
        featured: boolean;
        url: string | null;
        youtubeId: string | null;
        thumbnail: string | null;
        duration: string | null;
    }>>;
    findOne(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        title: string;
        featured: boolean;
        url: string | null;
        youtubeId: string | null;
        thumbnail: string | null;
        duration: string | null;
    }>;
    update(id: string, dto: any): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        title: string;
        featured: boolean;
        url: string | null;
        youtubeId: string | null;
        thumbnail: string | null;
        duration: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        title: string;
        featured: boolean;
        url: string | null;
        youtubeId: string | null;
        thumbnail: string | null;
        duration: string | null;
    }>;
    getFeatured(limit?: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        order: number;
        title: string;
        featured: boolean;
        url: string | null;
        youtubeId: string | null;
        thumbnail: string | null;
        duration: string | null;
    }[]>;
}
