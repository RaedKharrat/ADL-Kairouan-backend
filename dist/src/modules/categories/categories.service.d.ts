import { PrismaService } from '../../prisma/prisma.service';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private slug;
    findProjectCategories(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            projects: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        order: number;
    })[]>;
    createProjectCategory(data: {
        name: string;
        description?: string;
        order?: number;
    }): import(".prisma/client").Prisma.Prisma__ProjectCategoryClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        order: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateProjectCategory(id: string, data: Partial<{
        name: string;
        description: string;
        order: number;
    }>): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        order: number;
    }>;
    removeProjectCategory(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        order: number;
    }>;
    findBlogCategories(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            posts: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
    })[]>;
    createBlogCategory(data: {
        name: string;
        description?: string;
    }): import(".prisma/client").Prisma.Prisma__BlogCategoryClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    updateBlogCategory(id: string, data: Partial<{
        name: string;
        description: string;
    }>): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
    }>;
    removeBlogCategory(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
    }>;
    findMediaCategories(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            media: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    })[]>;
    createMediaCategory(data: {
        name: string;
    }): import(".prisma/client").Prisma.Prisma__MediaCategoryClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    removeMediaCategory(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }>;
    findReportCategories(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            reports: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    })[]>;
    createReportCategory(data: {
        name: string;
    }): import(".prisma/client").Prisma.Prisma__ReportCategoryClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    removeReportCategory(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }>;
    findFaqCategories(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            faqs: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    })[]>;
    createFaqCategory(data: {
        name: string;
    }): import(".prisma/client").Prisma.Prisma__FaqCategoryClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    removeFaqCategory(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }>;
}
