import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
export declare class PartnersController {
    private readonly partnersService;
    constructor(partnersService: PartnersService);
    findPublic(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        website: string | null;
        logo: string;
    }[]>;
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
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        website: string | null;
        logo: string;
    }[]>;
    reorder(body: {
        ids: string[];
    }): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        website: string | null;
        logo: string;
    }[]>;
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
}
