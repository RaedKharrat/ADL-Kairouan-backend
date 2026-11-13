import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamMemberDto {
  @ApiProperty({ description: 'Nom complet du membre' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Rôle ou fonction (ex: Directeur Bureau)' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiPropertyOptional({ description: 'Pôle ou département (ex: Pôle Stratégique)' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({ description: 'Courte biographie ou présentation' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: "URL de l'avatar/photo" })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: 'Adresse email professionnelle' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Numéro de téléphone' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Lien LinkedIn' })
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiPropertyOptional({ description: 'Lien Twitter / X' })
  @IsOptional()
  @IsString()
  twitter?: string;

  @ApiPropertyOptional({ description: "Ordre d'affichage (ranking)", default: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiPropertyOptional({ description: 'Statut actif', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

