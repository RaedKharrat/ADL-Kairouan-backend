import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(query: string, limit?: number): Promise<{
        projects: {
            id: string;
            slug: string;
            title: string;
            excerpt: string | null;
            coverImage: string | null;
            category: {
                name: string;
            } | null;
        }[];
        blogPosts: {
            id: string;
            slug: string;
            title: string;
            excerpt: string | null;
            coverImage: string | null;
            publishedAt: Date | null;
            category: {
                name: string;
            } | null;
        }[];
        reports: {
            id: string;
            description: string | null;
            title: string;
            fileUrl: string;
            year: number | null;
        }[];
    }>;
}
