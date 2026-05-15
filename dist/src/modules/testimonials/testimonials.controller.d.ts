import { TestimonialsService } from './testimonials.service';
export declare class TestimonialsController {
    private readonly svc;
    constructor(svc: TestimonialsService);
    findPublic(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        avatar: string | null;
        role: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        content: string;
        featured: boolean;
        organization: string | null;
        rating: number | null;
    }[]>;
    getFeatured(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        avatar: string | null;
        role: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        content: string;
        featured: boolean;
        organization: string | null;
        rating: number | null;
    }[]>;
    create(dto: any): import(".prisma/client").Prisma.Prisma__TestimonialClient<{
        id: string;
        name: string;
        avatar: string | null;
        role: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        content: string;
        featured: boolean;
        organization: string | null;
        rating: number | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        avatar: string | null;
        role: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        content: string;
        featured: boolean;
        organization: string | null;
        rating: number | null;
    }[]>;
    reorder(body: {
        ids: string[];
    }): Promise<{
        id: string;
        name: string;
        avatar: string | null;
        role: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        content: string;
        featured: boolean;
        organization: string | null;
        rating: number | null;
    }[]>;
    update(id: string, dto: any): Promise<{
        id: string;
        name: string;
        avatar: string | null;
        role: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        content: string;
        featured: boolean;
        organization: string | null;
        rating: number | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        avatar: string | null;
        role: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        content: string;
        featured: boolean;
        organization: string | null;
        rating: number | null;
    }>;
}
