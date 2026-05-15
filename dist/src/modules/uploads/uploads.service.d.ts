import { ConfigService } from '@nestjs/config';
import { UploadApiResponse } from 'cloudinary';
import { PrismaService } from '../../prisma/prisma.service';
export declare class UploadsService {
    private readonly config;
    private readonly prisma;
    constructor(config: ConfigService, prisma: PrismaService);
    private getMediaType;
    private getFolder;
    uploadFile(file: Express.Multer.File, categoryId?: string): Promise<UploadApiResponse>;
    uploadMultiple(files: Express.Multer.File[], categoryId?: string): Promise<UploadApiResponse[]>;
    deleteFile(publicId: string): Promise<any>;
}
