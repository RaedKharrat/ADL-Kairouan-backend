import { Controller, Post, Delete, UseInterceptors, UploadedFile, UploadedFiles, Param, Body, UseGuards, Version } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('uploads')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('single')
  @ApiOperation({ summary: 'Upload single file to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadSingle(@UploadedFile() file: Express.Multer.File, @Body('categoryId') categoryId?: string) {
    return this.uploadsService.uploadFile(file, categoryId);
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Upload multiple files to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 20))
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[], @Body('categoryId') categoryId?: string) {
    return this.uploadsService.uploadMultiple(files, categoryId);
  }

  @Delete(':publicId')
  @ApiOperation({ summary: 'Delete file from Cloudinary by publicId' })
  delete(@Param('publicId') publicId: string) {
    return this.uploadsService.deleteFile(decodeURIComponent(publicId));
  }
}
