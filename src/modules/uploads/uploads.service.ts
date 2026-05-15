import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { PrismaService } from '../../prisma/prisma.service';
import { MediaType } from '@prisma/client';
import * as path from 'path';

@Injectable()
export class UploadsService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  private getMediaType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) return MediaType.IMAGE;
    if (mimeType.startsWith('video/')) return MediaType.VIDEO;
    if (mimeType.startsWith('audio/')) return MediaType.AUDIO;
    return MediaType.DOCUMENT;
  }

  private getFolder(type: MediaType): string {
    const base = this.config.get<string>('cloudinary.folder', 'adl-kairouan');
    const subfolders: Record<MediaType, string> = {
      IMAGE: 'images',
      VIDEO: 'videos',
      DOCUMENT: 'documents',
      AUDIO: 'audio',
    };
    return `${base}/${subfolders[type]}`;
  }

  async uploadFile(file: Express.Multer.File, categoryId?: string): Promise<UploadApiResponse> {
    const mediaType = this.getMediaType(file.mimetype);
    const folder = this.getFolder(mediaType);
    const resourceType = mediaType === MediaType.VIDEO ? 'video' : mediaType === MediaType.DOCUMENT ? 'raw' : 'image';

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: resourceType,
            use_filename: true,
            unique_filename: true,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result!);
          },
        )
        .end(file.buffer);
    }).then(async (result: UploadApiResponse) => {
      // Save to DB
      await this.prisma.mediaItem.create({
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          type: mediaType,
          filename: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          width: result.width,
          height: result.height,
          ...(categoryId && { categoryId }),
        },
      });
      return result;
    });
  }

  async uploadMultiple(files: Express.Multer.File[], categoryId?: string) {
    return Promise.all(files.map((f) => this.uploadFile(f, categoryId)));
  }

  async deleteFile(publicId: string) {
    const result = await cloudinary.uploader.destroy(publicId);
    await this.prisma.mediaItem.deleteMany({ where: { publicId } });
    return result;
  }
}
