import { FaqService } from './faq.service';
export declare class FaqController {
    private readonly faqService;
    constructor(faqService: FaqService);
    findPublic(categoryId?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    create(dto: any): import(".prisma/client").Prisma.Prisma__FAQClient<{
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
    findAll(categoryId?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    reorder(body: {
        ids: string[];
    }): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        categoryId: string | null;
        question: string;
        answer: string;
    }[]>;
    update(id: string, dto: any): Promise<{
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
}
