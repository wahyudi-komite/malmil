import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { InventoryLog } from './entities/inventory-log.entity';
import { ProductVariant } from '../entities/product-variant.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryLog)
    private readonly logRepo: Repository<InventoryLog>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
  ) {}

  async logChange(
    variantId: string,
    changeQty: number,
    reason: string,
    referenceType?: string,
    referenceId?: string,
  ): Promise<InventoryLog> {
    const log = this.logRepo.create({
      variant: { id: variantId } as any,
      change_qty: changeQty,
      reason,
      reference_type: referenceType || null,
      reference_id: referenceId || null,
    });
    return this.logRepo.save(log);
  }

  async getStockHistory(variantId: string, limit = 50): Promise<InventoryLog[]> {
    return this.logRepo.find({
      where: { variant: { id: variantId } },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async getLowStockItems(threshold = 5) {
    const variants = await this.variantRepo.find({
      where: { is_active: true, stock_qty: LessThan(threshold) },
      relations: ['product'],
      order: { stock_qty: 'ASC' },
    });

    return variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      name: v.name,
      product_name: v.product?.name || '',
      stock_qty: v.stock_qty,
      low_stock_threshold: v.low_stock_threshold,
    }));
  }

  async getStockSummary() {
    const totalVariants = await this.variantRepo.count({ where: { is_active: true } });
    const totalStock = await this.variantRepo
      .createQueryBuilder('v')
      .select('COALESCE(SUM(v.stock_qty), 0)', 'total')
      .where('v.is_active = :active', { active: true })
      .getRawOne();

    const lowStock = await this.variantRepo.count({
      where: { is_active: true },
      relations: ['product'],
    });

    const lowStockCount = (await this.getLowStockItems()).length;

    return {
      total_variants: totalVariants,
      total_stock: Number(totalStock?.total || 0),
      low_stock_count: lowStockCount,
    };
  }
}
