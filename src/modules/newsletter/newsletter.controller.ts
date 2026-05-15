import { Controller, Get, Post, Delete, Body, Param, UseGuards, Query, Req, Version, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { NewsletterService } from './newsletter.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

class SubscribeDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
}

@ApiTags('newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Public() @Post('subscribe') @HttpCode(HttpStatus.CREATED) @Throttle({ default: { limit: 3, ttl: 60000 } })
  subscribe(@Body() dto: SubscribeDto, @Req() req: Request) { return this.newsletterService.subscribe(dto.email, dto.name, req.ip); }

  @Public() @Post('unsubscribe') @HttpCode(HttpStatus.OK)
  unsubscribe(@Body() body: { email: string }) { return this.newsletterService.unsubscribe(body.email); }

  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth') @Get() findAll(@Query() query: PaginationDto) { return this.newsletterService.findAll(query); }
  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth') @Get('stats') getStats() { return this.newsletterService.getStats(); }
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth') @Delete(':id') @Roles(Role.SUPER_ADMIN, Role.ADMIN) remove(@Param('id') id: string) { return this.newsletterService.remove(id); }
}
