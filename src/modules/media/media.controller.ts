import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query, Version } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role, MediaType } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('media') @Controller('media') export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Public() @Get('public') findPublic(@Query() query: PaginationDto & { type?: MediaType }) { return this.mediaService.findAll(query); }
  @Public() @Get('categories/public') findCategories() { return this.mediaService.findAllCategories(); }

  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth') @Get() findAll(@Query() query: PaginationDto) { return this.mediaService.findAll(query); }
  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth') @Get(':id') findOne(@Param('id') id: string) { return this.mediaService.findOne(id); }
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth') @Patch(':id') @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR) update(@Param('id') id: string, @Body() dto: any) { return this.mediaService.update(id, dto); }
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth') @Delete('bulk') @Roles(Role.SUPER_ADMIN, Role.ADMIN) bulkDelete(@Body() body: { ids: string[] }) { return this.mediaService.bulkDelete(body.ids); }
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth') @Delete(':id') @Roles(Role.SUPER_ADMIN, Role.ADMIN) remove(@Param('id') id: string) { return this.mediaService.remove(id); }
  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth') @Get('categories') getCategories() { return this.mediaService.findAllCategories(); }
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth') @Post('categories') @Roles(Role.SUPER_ADMIN, Role.ADMIN) createCategory(@Body() dto: any) { return this.mediaService.createCategory(dto); }
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth') @Delete('categories/:id') @Roles(Role.SUPER_ADMIN, Role.ADMIN) deleteCategory(@Param('id') id: string) { return this.mediaService.deleteCategory(id); }
}
