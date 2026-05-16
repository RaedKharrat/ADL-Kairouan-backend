import { PrismaService } from '../../prisma/prisma.service';
export declare class TagsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private slug;
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
    create(data: {
        name: string;
    }): import(".prisma/client").Prisma.Prisma__BlogTagClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: {
        name: string;
    }): Promise<{
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
