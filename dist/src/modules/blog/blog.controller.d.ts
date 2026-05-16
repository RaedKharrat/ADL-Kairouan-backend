import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { BlogPaginationDto } from './dto/blog-pagination.dto';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    findPublished(query: BlogPaginationDto): Promise<import("../../common/dto/pagination.dto").PaginatedResult<{
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
        _count: {
            comments: number;
        };
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
        videoUrl: string | null;
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        categoryId: string | null;
        scheduledAt: Date | null;
        readingTime: number | null;
        likes: number;
        authorId: string | null;
    }>>;
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
        videoUrl: string | null;
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        categoryId: string | null;
        scheduledAt: Date | null;
        readingTime: number | null;
        likes: number;
        authorId: string | null;
    })[]>;
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
        videoUrl: string | null;
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        categoryId: string | null;
        scheduledAt: Date | null;
        readingTime: number | null;
        likes: number;
        authorId: string | null;
    }>;
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
        videoUrl: string | null;
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        categoryId: string | null;
        scheduledAt: Date | null;
        readingTime: number | null;
        likes: number;
        authorId: string | null;
    })[]>;
    like(id: string): Promise<{
        id: string;
        likes: number;
    }>;
    addComment(id: string, dto: {
        name: string;
        content: string;
        email?: string;
    }): Promise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        isPublic: boolean;
        isAdmin: boolean;
        blogPostId: string;
    }>;
    getComments(id: string): Promise<{
        id: string;
        email: string | null;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        isPublic: boolean;
        isAdmin: boolean;
        blogPostId: string;
    }[]>;
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
        videoUrl: string | null;
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        categoryId: string | null;
        scheduledAt: Date | null;
        readingTime: number | null;
        likes: number;
        authorId: string | null;
    }>;
    findAll(query: BlogPaginationDto): Promise<import("../../common/dto/pagination.dto").PaginatedResult<{
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
        _count: {
            comments: number;
        };
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
        videoUrl: string | null;
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        categoryId: string | null;
        scheduledAt: Date | null;
        readingTime: number | null;
        likes: number;
        authorId: string | null;
    }>>;
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
        videoUrl: string | null;
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        categoryId: string | null;
        scheduledAt: Date | null;
        readingTime: number | null;
        likes: number;
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
        videoUrl: string | null;
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        categoryId: string | null;
        scheduledAt: Date | null;
        readingTime: number | null;
        likes: number;
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
        videoUrl: string | null;
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        categoryId: string | null;
        scheduledAt: Date | null;
        readingTime: number | null;
        likes: number;
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
        videoUrl: string | null;
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        categoryId: string | null;
        scheduledAt: Date | null;
        readingTime: number | null;
        likes: number;
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
        videoUrl: string | null;
        featured: boolean;
        status: import(".prisma/client").$Enums.PublishStatus;
        publishedAt: Date | null;
        seoTitle: string | null;
        seoDescription: string | null;
        seoKeywords: string[];
        ogImage: string | null;
        views: number;
        categoryId: string | null;
        scheduledAt: Date | null;
        readingTime: number | null;
        likes: number;
        authorId: string | null;
    }>;
}
