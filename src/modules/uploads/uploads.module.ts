import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { memoryStorage } from 'multer';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        storage: memoryStorage(),
        limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
        fileFilter: (_req, file, cb) => {
          const allowed = /\.(jpg|jpeg|png|gif|webp|svg|pdf|xlsx|xls|doc|docx|mp4|mov|avi|mp3)$/i;
          if (!file.originalname.match(allowed)) {
            return cb(new Error('File type not allowed'), false);
          }
          cb(null, true);
        },
      }),
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService, CloudinaryProvider],
  exports: [UploadsService, CloudinaryProvider],
})
export class UploadsModule {}
