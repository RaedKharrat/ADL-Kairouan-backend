import { IsEmail, IsString, IsEnum, IsOptional, MinLength, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ enum: Role, default: Role.EDITOR })
  @IsOptional()
  @IsEnum(Role)
  role?: Role = Role.EDITOR;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar?: string;
}
