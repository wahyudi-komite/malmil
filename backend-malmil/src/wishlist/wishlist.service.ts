import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepo: Repository<Wishlist>,
  ) {}

  async findByUser(userId: string) {
    const items = await this.wishlistRepo.find({
      where: { user: { id: userId } },
      relations: ['product', 'product.images', 'product.variants'],
      order: { created_at: 'DESC' },
    });

    return items.map((item) => ({
      id: item.id,
      product: item.product,
      created_at: item.created_at,
    }));
  }

  async toggle(userId: string, productId: string): Promise<{ added: boolean }> {
    const existing = await this.wishlistRepo.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (existing) {
      await this.wishlistRepo.remove(existing);
      return { added: false };
    }

    await this.wishlistRepo.save(
      this.wishlistRepo.create({
        user: { id: userId },
        product: { id: productId },
      }),
    );

    return { added: true };
  }

  async add(userId: string, productId: string) {
    const existing = await this.wishlistRepo.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (existing) {
      throw new ConflictException('Produk sudah ada di wishlist');
    }

    const item = this.wishlistRepo.create({
      user: { id: userId },
      product: { id: productId },
    });

    return this.wishlistRepo.save(item);
  }

  async remove(userId: string, productId: string): Promise<void> {
    const result = await this.wishlistRepo.delete({
      user: { id: userId },
      product: { id: productId },
    });

    if (!result.affected) {
      throw new NotFoundException('Wishlist item tidak ditemukan');
    }
  }

  async check(userId: string, productId: string): Promise<boolean> {
    const count = await this.wishlistRepo.count({
      where: { user: { id: userId }, product: { id: productId } },
    });
    return count > 0;
  }
}
