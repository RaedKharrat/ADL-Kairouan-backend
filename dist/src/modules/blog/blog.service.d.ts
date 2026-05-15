import { PrismaService } from '../../prisma/prisma.service';
import { PublishStatus } from '@prisma/client';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class BlogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateSlug;
    private calculateReadingTime;
    create(dto: CreateBlogPostDto, authorId: string): Promise<{
        tags: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
        }[];
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
        } | null;
        author: {
            id: string;
            name: string;
            avatar: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        title: string;
        excerpt: string | null;
        content: string | null;
        coverImage: string | null;
        gallery: string[];
        pdfFiles: string[];
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        categoryId: string | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        scheduledAt: Date | null;
        readingTime: number | null;
        authorId: string | null;
    }>;
    findAll(query: PaginationDto & {
        status?: PublishStatus;
        categoryId?: string;
        featured?: boolean;
        tagId?: string;
    }): Promise<import("../../common/dto/pagination.dto").PaginatedResult<{
        tags: {
            id: string;
            name: string;
            slug: string;
        }[];
        category: {
            id: string;
            name: string;
            slug: string;
        } | null;
        author: {
            id: string;
            name: string;
            avatar: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        title: string;
        excerpt: string | null;
        content: string | null;
        coverImage: string | null;
        gallery: string[];
        pdfFiles: string[];
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        categoryId: string | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        scheduledAt: Date | null;
        readingTime: number | null;
        authorId: string | null;
    }>>;
    findPublished(query: PaginationDto & {
        categoryId?: string;
        tagId?: string;
    }): Promise<import("../../common/dto/pagination.dto").PaginatedResult<{
        tags: {
            id: string;
            name: string;
            slug: string;
        }[];
        category: {
            id: string;
            name: string;
            slug: string;
        } | null;
        author: {
            id: string;
            name: string;
            avatar: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        title: string;
        excerpt: string | null;
        content: string | null;
        coverImage: string | null;
        gallery: string[];
        pdfFiles: string[];
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        categoryId: string | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        scheduledAt: Date | null;
        readingTime: number | null;
        authorId: string | null;
    }>>;
    findBySlug(slug: string): Promise<{
        tags: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
        }[];
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
        } | null;
        author: {
            id: string;
            name: string;
            avatar: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        title: string;
        excerpt: string | null;
        content: string | null;
        coverImage: string | null;
        gallery: string[];
        pdfFiles: string[];
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        categoryId: string | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        scheduledAt: Date | null;
        readingTime: number | null;
        authorId: string | null;
    }>;
    findOne(id: string): Promise<{
        tags: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
        }[];
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
        } | null;
        author: {
            id: string;
            name: string;
            avatar: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        title: string;
        excerpt: string | null;
        content: string | null;
        coverImage: string | null;
        gallery: string[];
        pdfFiles: string[];
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        categoryId: string | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        scheduledAt: Date | null;
        readingTime: number | null;
        authorId: string | null;
    }>;
    update(id: string, dto: UpdateBlogPostDto): Promise<{
        tags: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
        }[];
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
        } | null;
        author: {
            id: string;
            name: string;
            avatar: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        title: string;
        excerpt: string | null;
        content: string | null;
        coverImage: string | null;
        gallery: string[];
        pdfFiles: string[];
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        categoryId: string | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        scheduledAt: Date | null;
        readingTime: number | null;
        authorId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        title: string;
        excerpt: string | null;
        content: string | null;
        coverImage: string | null;
        gallery: string[];
        pdfFiles: string[];
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        categoryId: string | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        scheduledAt: Date | null;
        readingTime: number | null;
        authorId: string | null;
    }>;
    togglePublish(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        title: string;
        excerpt: string | null;
        content: string | null;
        coverImage: string | null;
        gallery: string[];
        pdfFiles: string[];
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        categoryId: string | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        scheduledAt: Date | null;
        readingTime: number | null;
        authorId: string | null;
    }>;
    toggleFeatured(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        title: string;
        excerpt: string | null;
        content: string | null;
        coverImage: string | null;
        gallery: string[];
        pdfFiles: string[];
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        categoryId: string | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        scheduledAt: Date | null;
        readingTime: number | null;
        authorId: string | null;
    }>;
    getFeatured(limit?: number): Promise<({
        category: {
            id: string;
            name: string;
            slug: string;
        } | null;
        author: {
            id: string;
            name: string;
            avatar: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        title: string;
        excerpt: string | null;
        content: string | null;
        coverImage: string | null;
        gallery: string[];
        pdfFiles: string[];
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        categoryId: string | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        scheduledAt: Date | null;
        readingTime: number | null;
        authorId: string | null;
    })[]>;
    getRelated(id: string, limit?: number): Promise<({
        category: {
            id: string;
            name: string;
            slug: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        slug: string;
        title: string;
        excerpt: string | null;
        content: string | null;
        coverImage: string | null;
        gallery: string[];
        pdfFiles: string[];
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        categoryId: string | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        scheduledAt: Date | null;
        readingTime: number | null;
        authorId: string | null;
    })[]>;
}
