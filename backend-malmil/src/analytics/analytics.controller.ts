import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { HasPermission } from '../permissions/has-permission.decorator';

@UseGuards(AuthGuard, PermissionsGuard)
@Controller('admin/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @HasPermission('dashboard_view')
  @Get('dashboard')
  async getDashboard() {
    return this.analyticsService.getDashboard();
  }

  @HasPermission('dashboard_view')
  @Get('revenue-chart')
  async getRevenueChart(@Query('days') days?: number) {
    return this.analyticsService.getRevenueChart(days || 7);
  }
}
