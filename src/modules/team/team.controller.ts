import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TeamService } from './team.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamPaginationDto } from './dto/team-pagination.dto';
import { ReorderDto } from '../../common/dto/reorder.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  // ─── Public Routes ───────────────────────────────────────────
  @Public()
  @Get('public')
  @ApiOperation({ summary: 'Obtenir les membres actifs de l’équipe exécutive (public)' })
  findActive() {
    return this.teamService.findActive();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtenir les détails d’un membre' })
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(id);
  }

  // ─── Admin Routes ─────────────────────────────────────────────
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Créer un membre de l’équipe' })
  create(@Body() dto: CreateTeamMemberDto) {
    return this.teamService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({ summary: 'Lister tous les membres (admin)' })
  findAll(@Query() query: TeamPaginationDto) {
    return this.teamService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch('reorder')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Réorganiser l’ordre des membres de l’équipe' })
  reorder(@Body() dto: ReorderDto) {
    return this.teamService.reorder(dto.items);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Mettre à jour un membre' })
  update(@Param('id') id: string, @Body() dto: UpdateTeamMemberDto) {
    return this.teamService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/toggle-active')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Activer / désactiver un membre' })
  toggleActive(@Param('id') id: string) {
    return this.teamService.toggleActive(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Supprimer un membre' })
  remove(@Param('id') id: string) {
    return this.teamService.remove(id);
  }
}

