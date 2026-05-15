import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadSingle(file: Express.Multer.File, categoryId?: string): Promise<import("cloudinary").UploadApiResponse>;
    uploadMultiple(files: Express.Multer.File[], categoryId?: string): Promise<import("cloudinary").UploadApiResponse[]>;
    delete(publicId: string): Promise<any>;
}
