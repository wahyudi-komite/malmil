import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(AuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.wishlistService.findByUser(user.id);
  }

  @Post(':productId')
  async add(@Param('productId') productId: string, @CurrentUser() user: any) {
    return this.wishlistService.toggle(user.id, productId);
  }

  @Delete(':productId')
  async remove(@Param('productId') productId: string, @CurrentUser() user: any) {
    await this.wishlistService.remove(user.id, productId);
    return { message: 'Produk dihapus dari wishlist' };
  }

  @Get('check/:productId')
  async check(@Param('productId') productId: string, @CurrentUser() user: any) {
    const exists = await this.wishlistService.check(user.id, productId);
    return { in_wishlist: exists };
  }
}
