import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query, Version } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { VideosService } from './videos.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('videos') @Controller('videos') export class VideosController {
  constructor(private readonly videosService: VideosService) {}
  @Public() @Get('public') findPublic(@Query() query: PaginationDto) { return this.videosService.findAll(query); }
  @Public() @Get('featured') getFeatured(@Query('limit') limit?: number) { return this.videosService.getFeatured(limit); }
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth') @Post() @Roles(Role.SUPER_ADMIN, Role.ADMIN) create(@Body() dto: any) { return this.videosService.create(dto); }
  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth') @Get() findAll(@Query() query: PaginationDto) { return this.videosService.findAll(query); }
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth') @Patch(':id') @Roles(Role.SUPER_ADMIN, Role.ADMIN) update(@Param('id') id: string, @Body() dto: any) { return this.videosService.update(id, dto); }
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth') @Delete(':id') @Roles(Role.SUPER_ADMIN, Role.ADMIN) remove(@Param('id') id: string) { return this.videosService.remove(id); }
}
