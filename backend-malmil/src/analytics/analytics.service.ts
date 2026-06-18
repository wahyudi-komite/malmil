import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async getDashboard() {
    const totalOrders = await this.orderRepo.count();
    const totalProducts = await this.productRepo.count();

    const revenueResult = await this.orderRepo
      .createQueryBuilder('order')
      .select('COALESCE(SUM(order.total), 0)', 'total')
      .where('order.status NOT IN (:...statuses)', {
        statuses: ['pending', 'cancelled'],
      })
      .getRawOne();

    const totalRevenue = Number(revenueResult?.total || 0);

    const recentOrders = await this.orderRepo.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
      take: 10,
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await this.orderRepo.count({
      where: { created_at: today as any },
    });

    const todayRevenue = await this.orderRepo
      .createQueryBuilder('order')
      .select('COALESCE(SUM(order.total), 0)', 'total')
      .where('order.created_at >= :today', { today })
      .andWhere('order.status NOT IN (:...statuses)', {
        statuses: ['pending', 'cancelled'],
      })
      .getRawOne();

    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // 1. Low stock products
    const lowStockVariants = await this.variantRepo.find({
      where: { is_active: true },
      relations: ['product'],
      order: { stock_qty: 'ASC' },
      take: 10,
    });
    const lowStock = lowStockVariants
      .filter((v) => v.stock_qty <= v.low_stock_threshold)
      .map((v) => ({
        variant_id: v.id,
        variant_name: v.name,
        sku: v.sku,
        stock_qty: v.stock_qty,
        threshold: v.low_stock_threshold,
        product_name: v.product?.name || '-',
      }));

    // 2. Orders by status
    const statusBreakdown = await this.orderRepo
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(order.id)', 'count')
      .groupBy('order.status')
      .getRawMany();
    const orders_by_status: Record<string, number> = {};
    const statusLabels = ['pending', 'waiting_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
    for (const s of statusLabels) {
      orders_by_status[s] = 0;
    }
    for (const row of statusBreakdown) {
      orders_by_status[row.status] = Number(row.count);
    }

    // 3. Top products (best sellers)
    const topProducts = await this.orderItemRepo
      .createQueryBuilder('item')
      .select('item.product_name', 'product_name')
      .addSelect('SUM(item.quantity)', 'total_sold')
      .addSelect('SUM(item.price * item.quantity)', 'total_revenue')
      .groupBy('item.product_name')
      .orderBy('SUM(item.quantity)', 'DESC')
      .take(5)
      .getRawMany();

    // 4. Recent activity
    const recentActivity = await this.auditRepo.find({
      order: { createdAt: 'DESC' },
      take: 10,
    });

    // 5. Alerts: new pending orders today
    const pendingToday = await this.orderRepo.count({
      where: {
        status: 'pending' as any,
        created_at: today as any,
      },
    });

    return {
      total_orders: totalOrders,
      total_revenue: totalRevenue,
      total_products: totalProducts,
      average_order_value: avgOrderValue,
      today_orders: todayOrders,
      today_revenue: Number(todayRevenue?.total || 0),
      recent_orders: recentOrders.map((order) => ({
        id: order.id,
        order_number: order.order_number,
        total: order.total,
        status: order.status,
        customer_name: order.user?.name || order.guest_name || '-',
        created_at: order.created_at,
      })),
      low_stock: lowStock,
      orders_by_status,
      top_products: topProducts.map((p) => ({
        product_name: p.product_name,
        total_sold: Number(p.total_sold),
        total_revenue: Number(p.total_revenue),
      })),
      recent_activity: recentActivity.map((a) => ({
        id: a.id,
        action: a.action,
        resource: a.resource,
        detail: a.detail,
        user_email: a.userEmail,
        created_at: a.createdAt,
      })),
      alerts: {
        pending_today: pendingToday,
      },
    };
  }

  async getRevenueChart(days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);

    const data = await this.orderRepo
      .createQueryBuilder('order')
      .select("DATE(order.created_at)", 'date')
      .addSelect('COALESCE(SUM(order.total), 0)', 'revenue')
      .addSelect('COUNT(order.id)', 'orders')
      .where('order.created_at >= :since', { since })
      .andWhere('order.status NOT IN (:...statuses)', {
        statuses: ['pending', 'cancelled'],
      })
      .groupBy("DATE(order.created_at)")
      .orderBy("DATE(order.created_at)", 'ASC')
      .getRawMany();

    return data.map((row) => ({
      date: row.date,
      revenue: Number(row.revenue),
      orders: Number(row.orders),
    }));
  }
}
