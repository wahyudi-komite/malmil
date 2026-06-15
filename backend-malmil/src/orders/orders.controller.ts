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
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post('orders')
  async create(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: any,
    @Headers('x-session-id') sessionId?: string,
  ) {
    return this.ordersService.createFromCart(user?.id, sessionId, dto);
  }

  @Public()
  @Get('orders/:orderNumber')
  async findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.findByOrderNumber(orderNumber);
  }

  @UseGuards(AuthGuard)
  @Get('my-orders')
  async myOrders(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ordersService.findByUser(user.id, page, limit);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('orders_view')
  @Get('admin/orders')
  async findAllAdmin(@Query() query: any) {
    return this.ordersService.findAllAdmin(query);
  }

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
