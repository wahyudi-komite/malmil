import { Controller, Get, Post, Put, Param, Body, UseGuards, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(AuthGuard)
  @Get('notifications')
  async findByUser(@CurrentUser() user: any, @Query('limit') limit?: number) {
    return this.notificationsService.findByUser(user.id, limit);
  }

  @UseGuards(AuthGuard)
  @Get('notifications/unread-count')
  async unreadCount(@CurrentUser() user: any) {
    const count = await this.notificationsService.getUnreadCount(user.id);
    return { count };
  }

  @UseGuards(AuthGuard)
  @Put('notifications/:id/read')
  async markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    await this.notificationsService.markAsRead(id, user.id);
    return { success: true };
  }

  @UseGuards(AuthGuard)
  @Put('notifications/read-all')
  async markAllAsRead(@CurrentUser() user: any) {
    await this.notificationsService.markAllAsRead(user.id);
    return { success: true };
  }

  @Public()
  @Post('newsletter/subscribe')
  async subscribe(@Body('email') email: string) {
    return this.notificationsService.subscribe(email);
  }

  @Public()
  @Post('newsletter/unsubscribe')
  async unsubscribe(@Body('email') email: string) {
    await this.notificationsService.unsubscribe(email);
    return { message: 'Berhasil berhenti berlangganan' };
  }
}
