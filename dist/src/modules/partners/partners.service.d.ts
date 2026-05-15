import { PrismaService } from '../../prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
export declare class PartnersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePartnerDto): import(".prisma/client").Prisma.Prisma__PartnerClient<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        website: string | null;
        logo: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(activeOnly?: boolean): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        website: string | null;
        logo: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        website: string | null;
        logo: string;
    }>;
    update(id: string, dto: UpdatePartnerDto): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        website: string | null;
        logo: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        website: string | null;
        logo: string;
    }>;
    reorder(ids: string[]): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        website: string | null;
        logo: string;
    }[]>;
}
