import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Kesehatan')
@SkipThrottle()
@Controller()
export class HealthController {
  @ApiOperation({ summary: 'Cek status server' })
  @Public()
  @Get('health')
  check() {
    return {
      status: 'ok',
      service: 'malmil-api',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
