import { IsString, IsOptional, IsBoolean, IsArray, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PublishStatus } from '@prisma/client';

export class CreateProjectDto {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  gallery?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  pdfFiles?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  tags?: string[];

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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  seoKeywords?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ogImage?: string;

  @ApiPropertyOptional({ description: 'Phase actuelle du projet (ex: Implémentation, Planification)' })
  @IsOptional()
  @IsString()
  phase?: string;

  @ApiPropertyOptional({ description: 'Objectif principal du projet (ex: Innovation Sociale)' })
  @IsOptional()
  @IsString()
  mainObjective?: string;

  @ApiPropertyOptional({ description: 'Partenaires impliqués (ex: ADL & PNUD)' })
  @IsOptional()
  @IsString()
  partners?: string;

  @ApiPropertyOptional({ description: 'Portée du projet (ex: Gouvernementale, Régionale)' })
  @IsOptional()
  @IsString()
  scope?: string;
}
