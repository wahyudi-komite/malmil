import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { InventoryController } from './inventory/inventory.controller';
import { InventoryService } from './inventory/inventory.service';
import { Product } from './entities/product.entity';
import { ProductCategory } from './entities/product-category.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';
import { InventoryLog } from './inventory/entities/inventory-log.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductCategory, ProductVariant, ProductImage, InventoryLog]),
    CommonModule,
  ],
  controllers: [ProductsController, InventoryController],
  providers: [ProductsService, InventoryService],
  exports: [ProductsService, InventoryService],
})
export class ProductsModule {}
