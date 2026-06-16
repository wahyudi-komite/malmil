import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @ApiOperation({ summary: 'Mendapatkan wishlist' })
  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.wishlistService.findByUser(user.id);
  }

  @ApiOperation({ summary: 'Menambahkan produk ke wishlist' })
  @ApiParam({ name: 'productId', description: 'ID produk' })
  @Post(':productId')
  async add(@Param('productId') productId: string, @CurrentUser() user: any) {
    return this.wishlistService.toggle(user.id, productId);
  }

  @ApiOperation({ summary: 'Menghapus produk dari wishlist' })
  @ApiParam({ name: 'productId', description: 'ID produk' })
  @Delete(':productId')
  async remove(@Param('productId') productId: string, @CurrentUser() user: any) {
    await this.wishlistService.remove(user.id, productId);
    return { message: 'Produk dihapus dari wishlist' };
  }

  @ApiOperation({ summary: 'Cek status wishlist produk' })
  @ApiParam({ name: 'productId', description: 'ID produk' })
  @Get('check/:productId')
  async check(@Param('productId') productId: string, @CurrentUser() user: any) {
    const exists = await this.wishlistService.check(user.id, productId);
    return { in_wishlist: exists };
  }
}
