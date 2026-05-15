import { IsString, IsOptional, IsBoolean, IsArray, IsEnum, MaxLength, ArrayMaxSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PublishStatus } from '@prisma/client';

export class CreateBlogPostDto {
  @ApiProperty() 
  @IsString() 
  title: string;

  @ApiPropertyOptional() 
  @IsOptional() 
  @IsString() 
  slug?: string;

  @ApiPropertyOptional() 
  @IsOptional() 
  @IsString() 
  excerpt?: string;

  @ApiPropertyOptional() 
  @IsOptional() 
  @IsString() 
  content?: string;

  @ApiPropertyOptional() 
  @IsOptional() 
  @IsString() 
  coverImage?: string;

  @ApiPropertyOptional({ type: [String], description: 'List of image URLs (max 5)' }) 
  @IsOptional() 
  @IsArray() 
  @ArrayMaxSize(5, { message: 'Maximum 5 images autorisées dans la galerie' })
  gallery?: string[];

  @ApiPropertyOptional({ type: [String], description: 'List of PDF file URLs' }) 
  @IsOptional() 
  @IsArray() 
  pdfFiles?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional() 
  @IsOptional() 
  @IsBoolean() 
  featured?: boolean;

  @ApiPropertyOptional({ enum: PublishStatus }) 
  @IsOptional() 
  @IsEnum(PublishStatus) 
  status?: PublishStatus;

  @ApiPropertyOptional() 
  @IsOptional() 
  @IsString() 
  categoryId?: string;

  @ApiPropertyOptional({ type: [String] }) 
  @IsOptional() 
  @IsArray() 
  tagIds?: string[];

  @ApiPropertyOptional() 
  @IsOptional() 
  @IsString() 
  seoTitle?: string;

  @ApiPropertyOptional() 
  @IsOptional() 
  @IsString() 
  seoDescription?: string;

  @ApiPropertyOptional({ type: [String] }) 
  @IsOptional() 
  @IsArray() 
  seoKeywords?: string[];

  @ApiPropertyOptional() 
  @IsOptional() 
  @IsString() 
  ogImage?: string;
}
