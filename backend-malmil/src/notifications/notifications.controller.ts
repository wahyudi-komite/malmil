import { Controller, Get, Post, Put, Param, Body, UseGuards, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Notifikasi')
@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Mendapatkan notifikasi' })
  @ApiQuery({ name: 'limit', required: false, description: 'Jumlah notifikasi' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @UseGuards(AuthGuard)
  @Get('notifications')
  async findByUser(@CurrentUser() user: any, @Query('limit') limit?: number) {
    return this.notificationsService.findByUser(user.id, limit);
  }

  @ApiOperation({ summary: 'Jumlah notifikasi belum dibaca' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @UseGuards(AuthGuard)
  @Get('notifications/unread-count')
  async unreadCount(@CurrentUser() user: any) {
    const count = await this.notificationsService.getUnreadCount(user.id);
    return { count };
  }

  @ApiOperation({ summary: 'Menandai notifikasi telah dibaca' })
  @ApiParam({ name: 'id', description: 'ID notifikasi' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 404, description: 'Notifikasi tidak ditemukan' })
  @UseGuards(AuthGuard)
  @Put('notifications/:id/read')
  async markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    await this.notificationsService.markAsRead(id, user.id);
    return { success: true };
  }

  @ApiOperation({ summary: 'Menandai semua notifikasi telah dibaca' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @UseGuards(AuthGuard)
  @Put('notifications/read-all')
  async markAllAsRead(@CurrentUser() user: any) {
    await this.notificationsService.markAllAsRead(user.id);
    return { success: true };
  }

  @ApiOperation({ summary: 'Berlangganan newsletter' })
  @Public()
  @Post('newsletter/subscribe')
  async subscribe(@Body('email') email: string) {
    return this.notificationsService.subscribe(email);
  }

  @ApiOperation({ summary: 'Berhenti berlangganan newsletter' })
  @Public()
  @Post('newsletter/unsubscribe')
  async unsubscribe(@Body('email') email: string) {
    await this.notificationsService.unsubscribe(email);
    return { message: 'Berhasil berhenti berlangganan' };
  }
}
