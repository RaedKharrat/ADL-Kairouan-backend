import { IsString, IsNotEmpty, IsOptional, IsInt, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectCategoryDto {
  @ApiProperty({ example: 'Environnement' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Projets liés à la transition écologique' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

export class UpdateProjectCategoryDto {
  @ApiPropertyOptional({ example: 'Environnement' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'Description mise à jour' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

export class CreateBlogCategoryDto {
  @ApiProperty({ example: 'Actualités' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Articles et actualités' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class UpdateBlogCategoryDto {
  @ApiPropertyOptional({ example: 'Actualités' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'Description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class CreateSimpleCategoryDto {
  @ApiProperty({ example: 'Photos d\'événements' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}

