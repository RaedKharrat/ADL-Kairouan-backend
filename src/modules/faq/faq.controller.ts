import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query, Version } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FaqService } from './faq.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('faq')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Public() @Get('public') findPublic(@Query('categoryId') categoryId?: string) { return this.faqService.findAll(true, categoryId); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Post() @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  create(@Body() dto: any) { return this.faqService.create(dto); }

  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth')
  @Get() findAll(@Query('categoryId') categoryId?: string) { return this.faqService.findAll(false, categoryId); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Patch('reorder') @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  reorder(@Body() body: { ids: string[] }) { return this.faqService.reorder(body.ids); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Patch(':id') @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  update(@Param('id') id: string, @Body() dto: any) { return this.faqService.update(id, dto); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Delete(':id') @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param('id') id: string) { return this.faqService.remove(id); }
}
