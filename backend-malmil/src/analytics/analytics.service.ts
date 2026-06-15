import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
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
