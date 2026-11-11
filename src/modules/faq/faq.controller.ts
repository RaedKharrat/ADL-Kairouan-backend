import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FaqService } from './faq.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';
import { CreateFaqDto, UpdateFaqDto } from './dto/faq.dto';

@ApiTags('faq')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Public() @Get('public') findPublic(@Query('categoryId') categoryId?: string) { return this.faqService.findAll(true, categoryId); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Post() @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Create FAQ' })
  create(@Body() dto: CreateFaqDto) { return this.faqService.create(dto); }

  @UseGuards(JwtAuthGuard) @ApiBearerAuth('JWT-auth')
  @Get() findAll(@Query('categoryId') categoryId?: string) { return this.faqService.findAll(false, categoryId); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Patch('reorder') @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Reorder FAQs' })
  reorder(@Body() body: { ids: string[] }) { return this.faqService.reorder(body.ids); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Patch(':id') @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Update FAQ' })
  update(@Param('id') id: string, @Body() dto: UpdateFaqDto) { return this.faqService.update(id, dto); }

  @UseGuards(JwtAuthGuard, RolesGuard) @ApiBearerAuth('JWT-auth')
  @Delete(':id') @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Delete FAQ' })
  remove(@Param('id') id: string) { return this.faqService.remove(id); }
}
