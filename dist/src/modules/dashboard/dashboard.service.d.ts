import { PrismaService } from '../../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSummary(): Promise<{
        projects: {
            total: number;
            published: number;
            draft: number;
        };
        blog: {
            total: number;
            published: number;
            draft: number;
        };
        partners: number;
        media: number;
        reports: number;
        faqs: number;
        testimonials: number;
        messages: {
            total: number;
            unread: number;
        };
        newsletter: {
            total: number;
            active: number;
        };
    }>;
    getRecentActivity(limit?: number): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        action: string;
        entity: string;
        entityId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        ip: string | null;
        userAgent: string | null;
        userId: string | null;
    })[]>;
    getRecentMessages(limit?: number): Promise<{
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        ip: string | null;
        userAgent: string | null;
        phone: string | null;
        subject: string | null;
        isRead: boolean;
        isArchived: boolean;
    }[]>;
    getTopProjects(limit?: number): Promise<{
        id: string;
        slug: string;
        title: string;
        coverImage: string | null;
        views: number;
    }[]>;
    getTopBlogPosts(limit?: number): Promise<{
        id: string;
        slug: string;
        title: string;
        coverImage: string | null;
        publishedAt: Date | null;
        views: number;
    }[]>;
    getMonthlyStats(): Promise<{
        year: number;
        month: number;
        label: string;
    }[]>;
}
