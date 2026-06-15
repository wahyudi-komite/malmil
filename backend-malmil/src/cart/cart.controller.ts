import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Headers, UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Keranjang')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  private resolveSession(user: any, sessionId: string | undefined) {
    return {
      userId: user?.id,
      sessionId: !user?.id ? sessionId : undefined,
    };
  }

  @ApiOperation({ summary: 'Mendapatkan isi keranjang' })
  @Public()
  @Get()
  async getCart(
    @CurrentUser() user: any,
    @Headers('x-session-id') sessionId?: string,
  ) {
    const { userId, sessionId: sid } = this.resolveSession(user, sessionId);
    return this.cartService.getCart(userId, sid);
  }

  @ApiOperation({ summary: 'Menambahkan item ke keranjang' })
  @Public()
  @Post('items')
  async addItem(
    @Body() dto: AddToCartDto,
    @CurrentUser() user: any,
    @Headers('x-session-id') sessionId?: string,
  ) {
    const { userId, sessionId: sid } = this.resolveSession(user, sessionId);
    return this.cartService.addItem(userId, sid, dto);
  }

  @ApiOperation({ summary: 'Memperbarui item di keranjang' })
  @ApiParam({ name: 'id', description: 'ID item keranjang' })
  @Public()
  @Patch('items/:id')
  async updateItem(
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
    @CurrentUser() user: any,
    @Headers('x-session-id') sessionId?: string,
  ) {
    const { userId, sessionId: sid } = this.resolveSession(user, sessionId);
    return this.cartService.updateItem(id, dto, userId, sid);
  }

  @ApiOperation({ summary: 'Menghapus item dari keranjang' })
  @ApiParam({ name: 'id', description: 'ID item keranjang' })
  @Public()
  @Delete('items/:id')
  async removeItem(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Headers('x-session-id') sessionId?: string,
  ) {
    const { userId, sessionId: sid } = this.resolveSession(user, sessionId);
    return this.cartService.removeItem(id, userId, sid);
  }

  @ApiOperation({ summary: 'Mengosongkan keranjang' })
  @Public()
  @Delete()
  async clearCart(
    @CurrentUser() user: any,
    @Headers('x-session-id') sessionId?: string,
  ) {
    const { userId, sessionId: sid } = this.resolveSession(user, sessionId);
    return this.cartService.clearCart(userId, sid);
  }

  @ApiOperation({ summary: 'Menerapkan kupon' })
  @Public()
  @Post('apply-coupon')
  async applyCoupon(
    @Body('code') code: string,
    @CurrentUser() user: any,
    @Headers('x-session-id') sessionId?: string,
  ) {
    const { userId, sessionId: sid } = this.resolveSession(user, sessionId);
    return this.cartService.applyCoupon(userId, sid, code);
  }

  @ApiOperation({ summary: 'Menghapus kupon dari keranjang' })
  @Public()
  @Delete('coupon')
  async removeCoupon(
    @CurrentUser() user: any,
    @Headers('x-session-id') sessionId?: string,
  ) {
    const { userId, sessionId: sid } = this.resolveSession(user, sessionId);
    return this.cartService.removeCoupon(userId, sid);
  }

  @ApiOperation({ summary: 'Menggabungkan keranjang tamu' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @UseGuards(AuthGuard)
  @Post('merge')
  async mergeCart(
    @CurrentUser() user: any,
    @Headers('x-session-id') sessionId?: string,
  ) {
    if (sessionId) {
      await this.cartService.mergeGuestCart(sessionId, user.id);
    }
    return this.cartService.getCart(user.id);
  }
}
