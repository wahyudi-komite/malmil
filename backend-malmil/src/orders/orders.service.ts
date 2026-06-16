import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../cart/entities/cart.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { InventoryLog } from '../products/inventory/entities/inventory-log.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
    private readonly dataSource: DataSource,
  ) {}

  async createFromCart(
    userId: string | undefined,
    sessionId: string | undefined,
    dto: CreateOrderDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cart = await this.cartRepo.findOne({
        where: userId ? { user: { id: userId } } : { session_id: sessionId },
        relations: ['items', 'items.variant', 'items.variant.product'],
      });

      if (!cart || !cart.items?.length) {
        throw new BadRequestException('Keranjang belanja kosong');
      }

      for (const item of cart.items) {
        if (!item.variant.is_active) {
          throw new BadRequestException(
            `Varian "${item.variant.name}" sudah tidak tersedia`,
          );
        }
        if (item.variant.stock_qty < item.quantity) {
          throw new BadRequestException(
            `Stok "${item.variant.name}" tidak mencukupi (tersedia: ${item.variant.stock_qty})`,
          );
        }
      }

      let discountAmount = 0;
      const couponCode = dto.coupon_code || cart.coupon_code;

      if (couponCode) {
        const coupon = await this.couponRepo.findOne({
          where: { code: couponCode, is_active: true },
        });

        if (!coupon) {
          throw new BadRequestException('Kode kupon tidak valid');
        }

        if (coupon.expires_at && new Date() > coupon.expires_at) {
          throw new BadRequestException('Kupon sudah kadaluarsa');
        }

        if (coupon.starts_at && new Date() < coupon.starts_at) {
          throw new BadRequestException('Kupon belum berlaku');
        }

        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
          throw new BadRequestException('Kupon sudah mencapai batas pemakaian');
        }

        const subtotal = cart.items.reduce(
          (sum, item) =>
            sum +
            Number(item.variant.price_override || item.variant.product.base_price) *
              item.quantity,
          0,
        );

        if (subtotal < coupon.min_order) {
          throw new BadRequestException(
            `Minimum order Rp${coupon.min_order.toLocaleString('id-ID')} untuk kupon ini`,
          );
        }

        if (coupon.type === 'percentage') {
          discountAmount = Math.round((subtotal * Number(coupon.value)) / 100);
          if (coupon.max_discount && discountAmount > Number(coupon.max_discount)) {
            discountAmount = Number(coupon.max_discount);
          }
        } else {
          discountAmount = Number(coupon.value);
        }

        coupon.used_count += 1;
        await queryRunner.manager.save(coupon);
      }

      const orderNumber = await this.generateOrderNumber();

      const subtotal = cart.items.reduce(
        (sum, item) =>
          sum +
          Number(item.variant.price_override || item.variant.product.base_price) *
            item.quantity,
        0,
      );

      const order = this.orderRepo.create({
        order_number: orderNumber,
        user: userId ? { id: userId } : null,
        address: { id: dto.address_id },
        coupon_code: couponCode || null,
        subtotal,
        shipping_cost: 0,
        discount_amount: discountAmount,
        total: subtotal - discountAmount,
        status: OrderStatus.PENDING,
        notes: dto.notes || null,
        courier_code: dto.courier_code,
        courier_service: dto.courier_service,
        guest_name: dto.guest_name || null,
        guest_email: dto.guest_email || null,
        guest_phone: dto.guest_phone || null,
      });

      const savedOrder = await queryRunner.manager.save(order);

      const orderItems = cart.items.map((item) =>
        this.orderItemRepo.create({
          order: { id: savedOrder.id },
          variant: { id: item.variant.id },
          product_name: item.variant.product.name,
          variant_name: item.variant.name,
          price: Number(item.variant.price_override || item.variant.product.base_price),
          quantity: item.quantity,
          weight_grams: item.variant.weight_grams,
        }),
      );

      await queryRunner.manager.save(orderItems);

      for (const item of cart.items) {
        await queryRunner.manager.update(
          ProductVariant,
          { id: item.variant.id },
          { stock_qty: () => `stock_qty - ${item.quantity}` },
        );

        await queryRunner.manager.save(InventoryLog, {
          variant: { id: item.variant.id },
          change_qty: -item.quantity,
          reason: 'order_placed',
          reference_type: 'order',
          reference_id: savedOrder.id,
        });
      }

      await queryRunner.manager.remove(cart.items);
      await queryRunner.manager.remove(cart);

      await queryRunner.commitTransaction();

      return this.findByOrderNumber(orderNumber);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.orderRepo.findOne({
      where: { order_number: orderNumber },
      relations: ['items', 'items.variant', 'address', 'payment'],
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    return order;
  }

  async findByUser(userId: string, page = 1, limit = 10) {
    const take = limit;
    const [data, total] = await this.orderRepo.findAndCount({
      where: { user: { id: userId } },
      relations: ['items', 'payment'],
      order: { created_at: 'DESC' },
      take,
      skip: (page - 1) * take,
    });

    return {
      data,
      meta: { total, page, last_page: Math.ceil(total / take), pageSize: take },
    };
  }

  async findAllAdmin(query: any) {
    const take = query.limit || 20;
    const page = query.page || 1;

    const qb = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.payment', 'payment')
      .leftJoinAndSelect('order.user', 'user');

    if (query.status) {
      qb.andWhere('order.status = :status', { status: query.status });
    }

    if (query.keyword) {
      qb.andWhere(
        '(order.order_number LIKE :keyword OR user.name LIKE :keyword OR user.email LIKE :keyword)',
        { keyword: `%${query.keyword}%` },
      );
    }

    qb.orderBy('order.created_at', 'DESC')
      .take(take)
      .skip((page - 1) * take);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: { total, page, last_page: Math.ceil(total / take), pageSize: take },
    };
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.orderRepo.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    if (dto.status === OrderStatus.CANCELLED && order.status !== OrderStatus.CANCELLED) {
      await this.restoreStock(order.id);
    }

    if (dto.status === OrderStatus.SHIPPED) {
      order.shipped_at = new Date();
    }

    if (dto.status === OrderStatus.DELIVERED) {
      order.delivered_at = new Date();
    }

    if (dto.tracking_number) {
      order.tracking_number = dto.tracking_number;
    }

    order.status = dto.status;

    if (dto.notes) {
      order.notes = dto.notes;
    }

    return this.orderRepo.save(order);
  }

  private async restoreStock(orderId: string) {
    const items = await this.orderItemRepo.find({
      where: { order: { id: orderId } },
      relations: ['variant'],
    });

    for (const item of items) {
      if (item.variant) {
        await this.variantRepo.update(
          { id: item.variant.id },
          { stock_qty: () => `stock_qty + ${item.quantity}` },
        );

        await this.dataSource.manager.save(InventoryLog, {
          variant: { id: item.variant.id },
          change_qty: item.quantity,
          reason: 'order_cancelled',
          reference_type: 'order',
          reference_id: orderId,
        });
      }
    }
  }

  private async generateOrderNumber(): Promise<string> {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = `MLM-${dateStr}-`;

    const lastOrder = await this.orderRepo
      .createQueryBuilder('order')
      .where('order.order_number LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('order.order_number', 'DESC')
      .getOne();

    let seq = 1;
    if (lastOrder) {
      const lastSeq = parseInt(lastOrder.order_number.split('-')[2], 10);
      seq = lastSeq + 1;
    }

    return `${prefix}${String(seq).padStart(5, '0')}`;
  }
}
