import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard stats retrieved successfully' })
  getDashboardStats(@Request() req) {
    return this.analyticsService.getDashboardStats(req.user.userId, req.user.role);
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get performance trends' })
  @ApiResponse({ status: 200, description: 'Performance trends retrieved successfully' })
  getPerformanceTrends(@Request() req, @Query('days') days?: string) {
    const daysNumber = days ? parseInt(days) : 30;
    return this.analyticsService.getPerformanceTrends(req.user.userId, req.user.role, daysNumber);
  }

  @Get('issues')
  @ApiOperation({ summary: 'Get common issues analysis' })
  @ApiResponse({ status: 200, description: 'Common issues retrieved successfully' })
  getCommonIssues(@Request() req) {
    return this.analyticsService.getCommonIssues(req.user.userId, req.user.role);
  }
}
