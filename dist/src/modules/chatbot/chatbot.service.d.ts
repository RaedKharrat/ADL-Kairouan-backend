import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export declare class ChatbotService implements OnModuleInit {
    private configService;
    private prisma;
    private ai;
    constructor(configService: ConfigService, prisma: PrismaService);
    onModuleInit(): void;
    private initModel;
    generateResponse(message: string, history?: any[]): Promise<any>;
}
