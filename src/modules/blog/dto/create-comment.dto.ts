import { IsString, IsNotEmpty, MaxLength, IsOptional, IsEmail, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Jean Dupont' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'jean@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Format d\'email invalide' })
  email?: string;

  @ApiProperty({ example: 'Bravo pour cette initiative !' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(1000, { message: 'Le commentaire ne peut pas dépasser 1000 caractères' })
  content: string;
}

