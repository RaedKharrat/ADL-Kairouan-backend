import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TestimonialsService } from './testimonials.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '@prisma/client';
import { CreateTestimonialDto, UpdateTestimonialDto } from './dto/testimonial.dto';

@ApiTags('testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly svc: TestimonialsService) {}

  @Public() @Get('public') findPublic() { return this.svc.findAll(true); }
  @Public() @Get('featured') getFeatured() { return this.svc.getFeatured(); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Create testimonial' })
  create(@Body() dto: CreateTestimonialDto) { return this.svc.create(dto); }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({ summary: 'List all testimonials' })
  findAll() { return this.svc.findAll(); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch('reorder')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Reorder testimonials' })
  reorder(@Body() body: { ids: string[] }) { return this.svc.reorder(body.ids); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Update testimonial' })
  update(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) { return this.svc.update(id, dto); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Delete testimonial' })
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}
