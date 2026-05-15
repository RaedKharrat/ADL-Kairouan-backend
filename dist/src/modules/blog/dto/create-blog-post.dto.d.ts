import { PublishStatus } from '@prisma/client';
export declare class CreateBlogPostDto {
    title: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    gallery?: string[];
    pdfFiles?: string[];
    videoUrl?: string;
    featured?: boolean;
    status?: PublishStatus;
    categoryId?: string;
    tagIds?: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
    ogImage?: string;
}
