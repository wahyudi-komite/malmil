import {
  Controller, Get, Post, Put, Param, Body, Query,
  Headers, UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { HasPermission } from '../permissions/has-permission.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Pesanan')
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Membuat pesanan baru' })
  @Public()
  @Post('orders')
  async create(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: any,
    @Headers('x-session-id') sessionId?: string,
  ) {
    return this.ordersService.createFromCart(user?.id, sessionId, dto);
  }

  @ApiOperation({ summary: 'Mendapatkan detail pesanan' })
  @ApiParam({ name: 'orderNumber', description: 'Nomor pesanan' })
  @ApiResponse({ status: 404, description: 'Pesanan tidak ditemukan' })
  @Public()
  @Get('orders/:orderNumber')
  async findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.findByOrderNumber(orderNumber);
  }

  @ApiOperation({ summary: 'Mendapatkan daftar pesanan sendiri' })
  @ApiQuery({ name: 'page', required: false, description: 'Halaman' })
  @ApiQuery({ name: 'limit', required: false, description: 'Jumlah per halaman' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @UseGuards(AuthGuard)
  @Get('my-orders')
  async myOrders(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ordersService.findByUser(user.id, page, limit);
  }

  @ApiOperation({ summary: 'Mendapatkan daftar pesanan (admin)' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('orders_view')
  @Get('admin/orders')
  async findAllAdmin(@Query() query: any) {
    return this.ordersService.findAllAdmin(query);
  }

  @ApiOperation({ summary: 'Memperbarui status pesanan' })
  @ApiParam({ name: 'id', description: 'ID pesanan' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @ApiResponse({ status: 404, description: 'Pesanan tidak ditemukan' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('orders_edit')
  @Put('admin/orders/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }
}
