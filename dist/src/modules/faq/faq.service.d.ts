import { PrismaService } from '../../prisma/prisma.service';
export declare class FaqService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: {
        question: string;
        answer: string;
        order?: number;
        categoryId?: string;
    }): import(".prisma/client").Prisma.Prisma__FAQClient<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
        } | null;
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        categoryId: string | null;
        question: string;
        answer: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(activeOnly?: boolean, categoryId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        category: {
            id: string;
            name: string;
            slug: string;
        } | null;
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        categoryId: string | null;
        question: string;
        answer: string;
    })[]>;
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
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        categoryId: string | null;
        question: string;
        answer: string;
    }>;
    update(id: string, dto: Partial<{
        question: string;
        answer: string;
        order: number;
        isActive: boolean;
        categoryId: string;
    }>): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
        } | null;
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        categoryId: string | null;
        question: string;
        answer: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        categoryId: string | null;
        question: string;
        answer: string;
    }>;
    reorder(ids: string[]): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        categoryId: string | null;
        question: string;
        answer: string;
    }[]>;
}
