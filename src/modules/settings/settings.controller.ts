import { Controller, Get, Post, Delete, Body, Param, UseGuards, Query, Version } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role, SettingGroup } from '@prisma/client';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()
  @Version('1')
  @Get('public')
  getPublic() {
    return this.settingsService.getPublicSettings();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Version('1')
  @Get()
  findAll(@Query('group') group?: SettingGroup) {
    return this.settingsService.findAll(group);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Version('1')
  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  upsert(@Body() body: { key: string; value: string; group?: SettingGroup; label?: string }) {
    return this.settingsService.upsert(body.key, body.value, body.group, body.label);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Version('1')
  @Post('bulk')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  upsertMany(@Body() body: { settings: { key: string; value: string; group?: SettingGroup; label?: string }[] }) {
    return this.settingsService.upsertMany(body.settings);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Version('1')
  @Delete(':key')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('key') key: string) {
    return this.settingsService.remove(key);
  }
}
