import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    getProjectCategories(): import(".prisma/client").Prisma.PrismaPromise<({
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
    getBlogCategories(): import(".prisma/client").Prisma.PrismaPromise<({
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
    getMediaCategories(): import(".prisma/client").Prisma.PrismaPromise<({
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
    getReportCategories(): import(".prisma/client").Prisma.PrismaPromise<({
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
    getFaqCategories(): import(".prisma/client").Prisma.PrismaPromise<({
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
    createProject(body: {
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
    updateProject(id: string, body: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        order: number;
    }>;
    removeProject(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        order: number;
    }>;
    createBlog(body: {
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
    updateBlog(id: string, body: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
    }>;
    removeBlog(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
    }>;
    createMedia(body: {
        name: string;
    }): import(".prisma/client").Prisma.Prisma__MediaCategoryClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    removeMedia(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }>;
    createReport(body: {
        name: string;
    }): import(".prisma/client").Prisma.Prisma__ReportCategoryClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    removeReport(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }>;
    createFaq(body: {
        name: string;
    }): import(".prisma/client").Prisma.Prisma__FaqCategoryClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    removeFaq(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }>;
}
