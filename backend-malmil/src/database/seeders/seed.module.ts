import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../../permissions/entities/permission.entity';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';
import { ProductCategory } from '../../products/entities/product-category.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';
import { ProductImage } from '../../products/entities/product-image.entity';
import { Coupon } from '../../coupons/entities/coupon.entity';
import { Banner } from '../../banners/entities/banner.entity';
import { Setting } from '../../settings/entities/setting.entity';
import { DatabaseSeeder } from './database-seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permission,
      Role,
      User,
      ProductCategory,
      Product,
      ProductVariant,
      ProductImage,
      Coupon,
      Banner,
      Setting,
    ]),
  ],
  providers: [DatabaseSeeder],
})
export class SeedModule {}
