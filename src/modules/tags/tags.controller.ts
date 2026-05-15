import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Version } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Public() @Get() findAll() { return this.tagsService.findAll(); }
  @Public() @Get(':id') findOne(@Param('id') id: string) { return this.tagsService.findOne(id); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @Post() create(@Body() body: { name: string }) { return this.tagsService.create(body); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @Patch(':id') update(@Param('id') id: string, @Body() body: { name: string }) { return this.tagsService.update(id, body); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':id') remove(@Param('id') id: string) { return this.tagsService.remove(id); }
}
