import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req, Version, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  submit(@Body() dto: CreateContactMessageDto, @Req() req: Request) {
    return this.contactService.create(dto, req.ip, req.get('user-agent'));
  }

  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth') @Get() findAll(@Query() query: PaginationDto) { return this.contactService.findAll(query); }
  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth') @Get('stats') getStats() { return this.contactService.getStats(); }
  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth') @Get(':id') findOne(@Param('id') id: string) { return this.contactService.findOne(id); }
  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth') @Patch(':id/read') markRead(@Param('id') id: string) { return this.contactService.markRead(id); }
  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth') @Patch(':id/archive') archive(@Param('id') id: string) { return this.contactService.archive(id); }
  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth') @Delete(':id') @Roles(Role.SUPER_ADMIN, Role.ADMIN) remove(@Param('id') id: string) { return this.contactService.remove(id); }
}
