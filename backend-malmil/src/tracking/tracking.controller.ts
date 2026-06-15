import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { TrackingService } from './tracking.service';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Tracking')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @ApiOperation({ summary: 'Melacak event' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @Post('event')
  async trackEvent(@Body() body: any) {
    await this.trackingService.trackEvent(body);
    return { received: true };
  }
}
