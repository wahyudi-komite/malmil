import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { PermissionsGuard } from '../../permissions/permissions.guard';
import { HasPermission } from '../../permissions/has-permission.decorator';
import { InventoryService } from './inventory.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from '../entities/product-variant.entity';
import { Product } from '../entities/product.entity';

@UseGuards(AuthGuard, PermissionsGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('admin/inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  @Get('summary')
  @HasPermission('inventory')
  async summary() {
    return this.inventoryService.getStockSummary();
  }

  @Get('low-stock')
  @HasPermission('inventory')
  async lowStock(@Query('threshold') threshold?: number) {
    return this.inventoryService.getLowStockItems(threshold ? +threshold : 5);
  }

  @Get('variants')
  @HasPermission('inventory')
  async variants(@Query() query: any) {
    const take = query.limit ? +query.limit : 25;
    const page = query.page ? +query.page : 1;
    const keyword = query.keyword || '';

    const qb = this.variantRepo
      .createQueryBuilder('v')
      .leftJoinAndSelect('v.product', 'p')
      .orderBy('v.stock_qty', 'ASC')
      .take(take)
      .skip((page - 1) * take);

    if (keyword) {
      qb.where('v.name LIKE :kw OR v.sku LIKE :kw OR p.name LIKE :kw', { kw: `%${keyword}%` });
    }

    const [data, total] = await qb.getManyAndCount();
    return {
      data: data.map((v) => ({
        id: v.id,
        sku: v.sku,
        name: v.name,
        product_name: (v as any).product?.name || '',
        product_id: (v as any).product?.id || '',
        stock_qty: v.stock_qty,
        low_stock_threshold: v.low_stock_threshold,
        is_active: v.is_active,
      })),
      meta: { total, page, last_page: Math.ceil(total / take), pageSize: take },
    };
  }

  @Get('history/:variantId')
  @HasPermission('inventory')
  async history(@Param('variantId') variantId: string) {
    return this.inventoryService.getStockHistory(variantId);
  }
}
