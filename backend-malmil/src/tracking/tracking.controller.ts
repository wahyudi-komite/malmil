import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post('event')
  async trackEvent(@Body() body: any) {
    await this.trackingService.trackEvent(body);
    return { received: true };
  }
}
