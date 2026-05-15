import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Version } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SeoService } from './seo.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('seo')
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  findAll(@Query('entityType') entityType?: string) {
    return this.seoService.findAll(entityType);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get(':entityType/:entityId')
  findOne(@Param('entityType') entityType: string, @Param('entityId') entityId: string) {
    return this.seoService.findByEntity(entityType, entityId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @Post(':entityType/:entityId')
  upsert(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Body() body: { title?: string; description?: string; keywords?: string[]; ogImage?: string; canonical?: string; noIndex?: boolean; noFollow?: boolean },
  ) {
    return this.seoService.upsert(entityType, entityId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':entityType/:entityId')
  remove(@Param('entityType') entityType: string, @Param('entityId') entityId: string) {
    return this.seoService.remove(entityType, entityId);
  }
}
