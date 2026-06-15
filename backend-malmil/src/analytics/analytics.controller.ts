import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { HasPermission } from '../permissions/has-permission.decorator';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('admin/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOperation({ summary: 'Mendapatkan data dashboard' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @HasPermission('dashboard_view')
  @Get('dashboard')
  async getDashboard() {
    return this.analyticsService.getDashboard();
  }

  @ApiOperation({ summary: 'Mendapatkan data grafik pendapatan' })
  @ApiQuery({ name: 'days', required: false, description: 'Jumlah hari' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @HasPermission('dashboard_view')
  @Get('revenue-chart')
  async getRevenueChart(@Query('days') days?: number) {
    return this.analyticsService.getRevenueChart(days || 7);
  }
}
