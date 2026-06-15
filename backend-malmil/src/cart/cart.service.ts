import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    private readonly dataSource: DataSource,
  ) {}

  private async findOrCreateCart(userId?: string, sessionId?: string): Promise<Cart> {
    let cart: Cart;

    if (userId) {
      cart = await this.cartRepo.findOne({
        where: { user: { id: userId } },
        relations: ['items', 'items.variant', 'items.variant.product', 'items.variant.product.images'],
      });
      if (cart) return cart;
    }

    if (sessionId) {
      cart = await this.cartRepo.findOne({
        where: { session_id: sessionId },
        relations: ['items', 'items.variant', 'items.variant.product', 'items.variant.product.images'],
      });
      if (cart) return cart;
    }

    cart = this.cartRepo.create({
      ...(userId && { user: { id: userId } }),
      ...(sessionId && !userId && { session_id: sessionId }),
    });

    return this.cartRepo.save(cart);
  }

  async getCart(userId?: string, sessionId?: string) {
    const cart = await this.findOrCreateCart(userId, sessionId);
    return this.formatCart(cart);
  }

  async addItem(userId: string | undefined, sessionId: string | undefined, dto: AddToCartDto) {
    const variant = await this.variantRepo.findOne({
      where: { id: dto.variant_id, is_active: true },
      relations: ['product'],
    });

    if (!variant) {
      throw new NotFoundException('Varian produk tidak ditemukan');
    }

    if (variant.stock_qty < dto.quantity) {
      throw new BadRequestException(`Stok tidak mencukupi. Stok tersedia: ${variant.stock_qty}`);
    }

    const cart = await this.findOrCreateCart(userId, sessionId);

    const existingItem = cart.items?.find((item) => item.variant.id === dto.variant_id);

    if (existingItem) {
      const newQty = existingItem.quantity + dto.quantity;
      if (variant.stock_qty < newQty) {
        throw new BadRequestException(`Stok tidak mencukupi. Stok tersedia: ${variant.stock_qty}`);
      }
      existingItem.quantity = newQty;
      await this.cartItemRepo.save(existingItem);
    } else {
      const item = this.cartItemRepo.create({
        cart: { id: cart.id },
        variant: { id: variant.id },
        quantity: dto.quantity,
      });
      await this.cartItemRepo.save(item);
    }

    return this.getCart(userId, sessionId);
  }

  async updateItem(
    itemId: string,
    dto: UpdateCartItemDto,
    userId?: string,
    sessionId?: string,
  ) {
    const cart = await this.findOrCreateCart(userId, sessionId);
    const item = cart.items?.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Item keranjang tidak ditemukan');
    }

    const variant = await this.variantRepo.findOne({ where: { id: item.variant.id } });
    if (variant && variant.stock_qty < dto.quantity) {
      throw new BadRequestException(`Stok tidak mencukupi. Stok tersedia: ${variant.stock_qty}`);
    }

    item.quantity = dto.quantity;
    await this.cartItemRepo.save(item);

    return this.getCart(userId, sessionId);
  }

  async removeItem(itemId: string, userId?: string, sessionId?: string) {
    const cart = await this.findOrCreateCart(userId, sessionId);
    const item = cart.items?.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Item keranjang tidak ditemukan');
    }

    await this.cartItemRepo.remove(item);
    return this.getCart(userId, sessionId);
  }

  async clearCart(userId?: string, sessionId?: string) {
    const cart = await this.findOrCreateCart(userId, sessionId);
    if (cart.items?.length) {
      await this.cartItemRepo.remove(cart.items);
    }
    return this.getCart(userId, sessionId);
  }

  async mergeGuestCart(sessionId: string, userId: string) {
    const guestCart = await this.cartRepo.findOne({
      where: { session_id: sessionId },
      relations: ['items'],
    });

    if (!guestCart || !guestCart.items?.length) return;

    const userCart = await this.findOrCreateCart(userId);

    for (const guestItem of guestCart.items) {
      const existing = userCart.items?.find(
        (i) => i.variant.id === guestItem.variant.id,
      );

      if (existing) {
        existing.quantity += guestItem.quantity;
        await this.cartItemRepo.save(existing);
      } else {
        guestItem.cart = userCart;
        await this.cartItemRepo.save(guestItem);
      }
    }

    await this.cartRepo.remove(guestCart);
  }

  async applyCoupon(userId: string | undefined, sessionId: string | undefined, code: string) {
    const cart = await this.findOrCreateCart(userId, sessionId);
    cart.coupon_code = code;
    await this.cartRepo.save(cart);
    return this.getCart(userId, sessionId);
  }

  async removeCoupon(userId?: string, sessionId?: string) {
    const cart = await this.findOrCreateCart(userId, sessionId);
    cart.coupon_code = null;
    await this.cartRepo.save(cart);
    return this.getCart(userId, sessionId);
  }

  private formatCart(cart: Cart) {
    const items = (cart.items || []).map((item) => ({
      id: item.id,
      variant_id: item.variant.id,
      product_name: item.variant.product?.name || '',
      variant_name: item.variant.name,
      sku: item.variant.sku,
      price: Number(item.variant.price_override || item.variant.product?.base_price || 0),
      weight_grams: item.variant.weight_grams,
      quantity: item.quantity,
      subtotal: Number(item.variant.price_override || item.variant.product?.base_price || 0) * item.quantity,
      image: item.variant.product?.images?.find((img) => img.is_primary)?.url || item.variant.product?.images?.[0]?.url || null,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const totalWeight = items.reduce((sum, item) => sum + item.weight_grams * item.quantity, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: cart.id,
      coupon_code: cart.coupon_code,
      items,
      subtotal,
      total_weight: totalWeight,
      total_items: totalItems,
    };
  }
}
