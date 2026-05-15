import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Version } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ─── Public reads ─────────────────────────────────────────────────────────
  @Public() @Get('projects') getProjectCategories() { return this.categoriesService.findProjectCategories(); }
  @Public() @Get('blog') getBlogCategories() { return this.categoriesService.findBlogCategories(); }
  @Public() @Get('media') getMediaCategories() { return this.categoriesService.findMediaCategories(); }
  @Public() @Get('reports') getReportCategories() { return this.categoriesService.findReportCategories(); }
  @Public() @Get('faq') getFaqCategories() { return this.categoriesService.findFaqCategories(); }

  // ─── Project categories ───────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @Post('projects') createProject(@Body() body: { name: string; description?: string; order?: number }) {
    return this.categoriesService.createProjectCategory(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @Patch('projects/:id') updateProject(@Param('id') id: string, @Body() body: any) {
    return this.categoriesService.updateProjectCategory(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete('projects/:id') removeProject(@Param('id') id: string) {
    return this.categoriesService.removeProjectCategory(id);
  }

  // ─── Blog categories ──────────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @Post('blog') createBlog(@Body() body: { name: string; description?: string }) {
    return this.categoriesService.createBlogCategory(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @Patch('blog/:id') updateBlog(@Param('id') id: string, @Body() body: any) {
    return this.categoriesService.updateBlogCategory(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete('blog/:id') removeBlog(@Param('id') id: string) {
    return this.categoriesService.removeBlogCategory(id);
  }

  // ─── Media categories ─────────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @Post('media') createMedia(@Body() body: { name: string }) {
    return this.categoriesService.createMediaCategory(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete('media/:id') removeMedia(@Param('id') id: string) {
    return this.categoriesService.removeMediaCategory(id);
  }

  // ─── Report categories ────────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @Post('reports') createReport(@Body() body: { name: string }) {
    return this.categoriesService.createReportCategory(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete('reports/:id') removeReport(@Param('id') id: string) {
    return this.categoriesService.removeReportCategory(id);
  }

  // ─── FAQ categories ───────────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @Post('faq') createFaq(@Body() body: { name: string }) {
    return this.categoriesService.createFaqCategory(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete('faq/:id') removeFaq(@Param('id') id: string) {
    return this.categoriesService.removeFaqCategory(id);
  }
}
