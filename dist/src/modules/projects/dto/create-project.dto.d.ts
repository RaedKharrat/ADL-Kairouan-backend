import { PublishStatus } from '@prisma/client';
export declare class CreateProjectDto {
    title: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    gallery?: string[];
    pdfFiles?: string[];
    tags?: string[];
    featured?: boolean;
    status?: PublishStatus;
    categoryId?: string;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    ogImage?: string;
}
