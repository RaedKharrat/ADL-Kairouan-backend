import { Controller, Get, UseGuards, Version } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('dashboard')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary') getSummary() { return this.dashboardService.getSummary(); }
  @Get('activity') getRecentActivity() { return this.dashboardService.getRecentActivity(); }
  @Get('messages') getRecentMessages() { return this.dashboardService.getRecentMessages(); }
  @Get('top-projects') getTopProjects() { return this.dashboardService.getTopProjects(); }
  @Get('top-posts') getTopBlogPosts() { return this.dashboardService.getTopBlogPosts(); }
  @Get('monthly-stats') getMonthlyStats() { return this.dashboardService.getMonthlyStats(); }
}
