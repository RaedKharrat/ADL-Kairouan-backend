import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query, Version } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Public() @Get('public') findPublished(@Query() query: PaginationDto) { return this.reportsService.findPublished(query); }
  @Public() @Patch(':id/download') download(@Param('id') id: string) { return this.reportsService.incrementDownload(id); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Post() @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  create(@Body() dto: any) { return this.reportsService.create(dto); }

  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth')
  @Get() findAll(@Query() query: PaginationDto) { return this.reportsService.findAll(query); }

  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth')
  @Get(':id') findOne(@Param('id') id: string) { return this.reportsService.findOne(id); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Patch(':id') @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: any) { return this.reportsService.update(id, dto); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Delete(':id') @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param('id') id: string) { return this.reportsService.remove(id); }
}
