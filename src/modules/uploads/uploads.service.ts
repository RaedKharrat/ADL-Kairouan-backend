import { Injectable, BadRequestException } from '@nestjs/common';
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

  private sanitizeFilename(filename: string): string {
    const basename = path.basename(filename);
    return basename.replace(/[^a-zA-Z0-9._-]/g, '_');
  }

  private validateFile(file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new BadRequestException('Fichier invalide ou manquant');
    }

    // Inspect SVG files for script tags and event handlers
    if (file.mimetype === 'image/svg+xml' || file.originalname.toLowerCase().endsWith('.svg')) {
      const content = file.buffer.toString('utf8').toLowerCase();
      if (
        content.includes('<script') ||
        content.includes('javascript:') ||
        content.includes('onload=') ||
        content.includes('onerror=') ||
        content.includes('<foreignobject')
      ) {
        throw new BadRequestException('Le fichier SVG contient du code potentiellement dangereux.');
      }
    }
  }

  async uploadFile(file: Express.Multer.File, categoryId?: string): Promise<UploadApiResponse> {
    this.validateFile(file);
    const mediaType = this.getMediaType(file.mimetype);
    const folder = this.getFolder(mediaType);
    const resourceType = mediaType === MediaType.VIDEO ? 'video' : mediaType === MediaType.DOCUMENT ? 'raw' : 'image';
    const safeFilename = this.sanitizeFilename(file.originalname);

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
          filename: safeFilename,
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
    if (!files || files.length === 0) {
      throw new BadRequestException('Aucun fichier fourni');
    }
    return Promise.all(files.map((f) => this.uploadFile(f, categoryId)));
  }

  async deleteFile(publicId: string) {
    if (!publicId || publicId.includes('..') || publicId.includes('/') === false && publicId.length < 3) {
      throw new BadRequestException('Identifiant de fichier invalide');
    }
    const result = await cloudinary.uploader.destroy(publicId);
    await this.prisma.mediaItem.deleteMany({ where: { publicId } });
    return result;
  }
}
