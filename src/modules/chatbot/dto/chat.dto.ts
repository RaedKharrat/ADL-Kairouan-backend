import { IsString, IsNotEmpty, MaxLength, IsOptional, IsArray, ArrayMaxSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChatMessageDto {
  @ApiProperty({ description: 'Message sent by the user', example: 'Quels sont les projets en cours ?' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, { message: 'Le message ne doit pas dépasser 1000 caractères' })
  message: string;

  @ApiPropertyOptional({ description: 'Previous conversation history' })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20, { message: 'L\'historique ne doit pas dépasser 20 messages' })
  history?: Array<{ role?: string; content?: string; parts?: Array<{ text?: string }> }>;
}

