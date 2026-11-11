import { TagsService } from './tags.service';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';
export declare class TagsController {
    private readonly tagsService;
    constructor(tagsService: TagsService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            posts: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    })[]>;
    findOne(id: string): import(".prisma/client").Prisma.Prisma__BlogTagClient<({
        _count: {
            posts: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    create(body: CreateTagDto): import(".prisma/client").Prisma.Prisma__BlogTagClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, body: UpdateTagDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }>;
}
