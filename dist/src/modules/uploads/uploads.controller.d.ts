import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadSingle(file: Express.Multer.File, categoryId?: string): Promise<{
        success: boolean;
        data: {
            url: string;
            publicId: string;
            size: number;
            format: string;
            resourceType: "video" | "raw" | "image" | "auto";
            width: number;
            height: number;
        };
    }>;
    uploadMultiple(files: Express.Multer.File[], categoryId?: string): Promise<{
        success: boolean;
        data: {
            url: string;
            publicId: string;
            size: number;
            format: string;
            resourceType: "video" | "raw" | "image" | "auto";
            width: number;
            height: number;
        }[];
    }>;
    delete(publicId: string): Promise<any>;
}
