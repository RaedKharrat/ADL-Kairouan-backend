import { Controller, Post, Delete, UseInterceptors, UploadedFile, UploadedFiles, Param, Body, UseGuards } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('uploads')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('single')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Upload single file to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(@UploadedFile() file: Express.Multer.File, @Body('categoryId') categoryId?: string) {
    const result = await this.uploadsService.uploadFile(file, categoryId);
    return {
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        size: result.bytes,
        format: result.format,
        resourceType: result.resource_type,
        width: result.width,
        height: result.height,
      }
    };
  }

  @Post('multiple')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Upload multiple files to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 20))
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[], @Body('categoryId') categoryId?: string) {
    const results = await this.uploadsService.uploadMultiple(files, categoryId);
    return {
      success: true,
      data: results.map(r => ({
        url: r.secure_url,
        publicId: r.public_id,
        size: r.bytes,
        format: r.format,
        resourceType: r.resource_type,
        width: r.width,
        height: r.height,
      }))
    };
  }

  @Delete(':publicId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Delete file from Cloudinary by publicId (Admin only)' })
  delete(@Param('publicId') publicId: string) {
    return this.uploadsService.deleteFile(decodeURIComponent(publicId));
  }
}
