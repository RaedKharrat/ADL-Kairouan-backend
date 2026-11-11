import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HeroService } from './hero.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';
import { CreateHeroDto, UpdateHeroDto } from './dto/hero.dto';

@ApiTags('hero')
@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Public()
  @Get('active')
  getActive() {
    return this.heroService.findActive();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  findAll() {
    return this.heroService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @Post()
  @ApiOperation({ summary: 'Create hero slide' })
  create(@Body() body: CreateHeroDto) {
    return this.heroService.create(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @Patch(':id')
  @ApiOperation({ summary: 'Update hero slide' })
  update(@Param('id') id: string, @Body() body: UpdateHeroDto) {
    return this.heroService.update(id, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete hero slide' })
  remove(@Param('id') id: string) {
    return this.heroService.remove(id);
  }
}
