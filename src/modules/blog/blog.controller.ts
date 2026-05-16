import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Version } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { BlogPaginationDto } from './dto/blog-pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Public() @Get('public') findPublished(@Query() query: BlogPaginationDto) { return this.blogService.findPublished(query); }
  @Public() @Get('featured') getFeatured(@Query('limit') limit?: number) { return this.blogService.getFeatured(limit); }
  @Public() @Get('slug/:slug') findBySlug(@Param('slug') slug: string) { return this.blogService.findBySlug(slug); }
  @Public() @Get(':id/related') getRelated(@Param('id') id: string, @Query('limit') limit?: number) { return this.blogService.getRelated(id, limit); }

  @Public() @Post(':id/like') like(@Param('id') id: string) { return this.blogService.like(id); }
  @Public() @Post(':id/comments') addComment(@Param('id') id: string, @Body() dto: { name: string; content: string; email?: string }) { return this.blogService.addComment(id, dto); }
  @Public() @Get(':id/comments') getComments(@Param('id') id: string) { return this.blogService.getComments(id); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Post() @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  create(@Body() dto: CreateBlogPostDto, @CurrentUser('id') authorId: string) { return this.blogService.create(dto, authorId); }

  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth')
  @Get() findAll(@Query() query: BlogPaginationDto) { return this.blogService.findAll(query); }

  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth')
  @Get(':id') findOne(@Param('id') id: string) { return this.blogService.findOne(id); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Patch(':id') @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  update(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) { return this.blogService.update(id, dto); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Patch(':id/toggle-publish') @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  togglePublish(@Param('id') id: string) { return this.blogService.togglePublish(id); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Patch(':id/toggle-featured') @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  toggleFeatured(@Param('id') id: string) { return this.blogService.toggleFeatured(id); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Delete(':id') @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param('id') id: string) { return this.blogService.remove(id); }
}
