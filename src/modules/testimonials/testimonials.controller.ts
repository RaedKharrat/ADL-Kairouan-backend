import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Version } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TestimonialsService } from './testimonials.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('testimonials') @Controller('testimonials') export class TestimonialsController {
  constructor(private readonly svc: TestimonialsService) {}
  @Public() @Get('public') findPublic() { return this.svc.findAll(true); }
  @Public() @Get('featured') getFeatured() { return this.svc.getFeatured(); }
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth') @Post() @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR) create(@Body() dto: any) { return this.svc.create(dto); }
  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth') @Get() findAll() { return this.svc.findAll(); }
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth') @Patch('reorder') @Roles(Role.SUPER_ADMIN, Role.ADMIN) reorder(@Body() body: { ids: string[] }) { return this.svc.reorder(body.ids); }
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth') @Patch(':id') @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR) update(@Param('id') id: string, @Body() dto: any) { return this.svc.update(id, dto); }
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth') @Delete(':id') @Roles(Role.SUPER_ADMIN, Role.ADMIN) remove(@Param('id') id: string) { return this.svc.remove(id); }
}
