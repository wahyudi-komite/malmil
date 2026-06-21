import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Permission } from '../../permissions/entities/permission.entity';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';
import { ProductCategory } from '../../products/entities/product-category.entity';
import { Product } from '../../products/entities/product.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';
import { ProductImage } from '../../products/entities/product-image.entity';
import { Coupon, CouponType } from '../../coupons/entities/coupon.entity';
import { Banner } from '../../banners/entities/banner.entity';
import { Setting } from '../../settings/entities/setting.entity';

@Injectable()
export class DatabaseSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    @InjectRepository(ProductImage)
    private readonly imageRepository: Repository<ProductImage>,
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('Seeding permissions...');
    const permissions = await this.seedPermissions();

    this.logger.log('Seeding roles...');
    const roles = await this.seedRoles(permissions);

    const userCount = await this.userRepository.count();
    if (userCount === 0) {
      await this.seedUsers(roles);
    } else {
      this.logger.log('Users already exist, skipping user seed');
    }

    this.logger.log('Seeding categories...');
    const categories = await this.seedCategories();

    this.logger.log('Seeding products, variants, and images...');
    await this.seedProducts(categories);

    this.logger.log('Seeding coupons...');
    await this.seedCoupons();

    this.logger.log('Seeding banners...');
    await this.seedBanners();

    this.logger.log('Seeding settings...');
    await this.seedSettings();

    this.logger.log('Seeding complete');
  }

  private async seedPermissions(): Promise<Permission[]> {
    const permissionNames = [
      // System
      'dashboard_view',
      'settings_view',
      'audit_view',

      // Users & Roles
      'users_view',
      'users_create',
      'users_edit',
      'users_delete',
      'roles_view',
      'roles_assign',
      'permissions_view',

      // Products
      'products_view',
      'products_create',
      'products_edit',
      'products_delete',

      // Categories
      'categories_view',
      'categories_create',
      'categories_edit',
      'categories_delete',

      // Orders
      'orders_view',
      'orders_edit',

      // Coupons
      'coupons_view',
      'coupons_create',
      'coupons_edit',
      'coupons_delete',

      // Banners
      'banners_view',
      'banners_create',
      'banners_edit',
      'banners_delete',

      // Customers
      'customers_view',
      'customers_edit',
    ];

    const permissions: Permission[] = [];
    for (const name of permissionNames) {
      const existing = await this.permissionRepository.findOne({
        where: { name },
      });
      if (!existing) {
        const permission = this.permissionRepository.create({ name });
        permissions.push(await this.permissionRepository.save(permission));
      } else {
        permissions.push(existing);
      }
    }

    this.logger.log(`Seeded ${permissions.length} permissions`);
    return permissions;
  }

  private async seedRoles(permissions: Permission[]): Promise<Role[]> {
    const rolesData = [
      {
        name: 'super_admin',
        permissions: permissions,
      },
      {
        name: 'admin',
        permissions: permissions.filter(
          (p) => !p.name.startsWith('roles_') && !p.name.startsWith('permissions_'),
        ),
      },
      {
        name: 'operator',
        permissions: permissions.filter((p) =>
          [
            'audit_view',
            'audit_view',
            'dashboard_view',
            'products_view',
            'categories_view',
            'orders_view',
            'orders_edit',
            'customers_view',
          ].includes(p.name),
        ),
      },
      {
        name: 'customer',
        permissions: [],
      },
    ];

    const roles: Role[] = [];
    for (const data of rolesData) {
      let role = await this.roleRepository.findOne({
        where: { name: data.name },
        relations: ['permissions'],
      });
      if (!role) {
        role = this.roleRepository.create({
          name: data.name,
          permissions: data.permissions,
        });
        roles.push(await this.roleRepository.save(role));
      } else {
        role.permissions = data.permissions;
        roles.push(await this.roleRepository.save(role));
      }
    }

    this.logger.log(`Seeded ${roles.length} roles`);
    return roles;
  }

  private async seedUsers(roles: Role[]): Promise<void> {
    const adminRole = roles.find((r) => r.name === 'super_admin');
    const operatorRole = roles.find((r) => r.name === 'operator');

    const hashedPassword = await bcrypt.hash('Astra123#', 12);

    const usersData = [
      {
        name: 'Administrator',
        email: 'adhye.yudhie@gmail.com',
        password: hashedPassword,
        role: adminRole,
        avatar: '',
      },
      {
        name: 'Operator',
        email: 'operator@example.com',
        password: hashedPassword,
        role: operatorRole,
        avatar: '',
      },
    ];

    for (const data of usersData) {
      const existing = await this.userRepository.findOne({
        where: { email: data.email },
      });
      if (!existing) {
        await this.userRepository.save(this.userRepository.create(data));
      }
    }

    this.logger.log('Seeded users');
  }

  private async seedCategories(): Promise<ProductCategory[]> {
    const categoriesData = [
      { name: 'Original Popcorn', slug: 'original-popcorn', description: 'Popcorn gurih rasa original klasik' },
      { name: 'Sweet Popcorn', slug: 'sweet-popcorn', description: 'Popcorn karamel manis dan lezat' },
      { name: 'Spicy Popcorn', slug: 'spicy-popcorn', description: 'Popcorn pedas menggugah selera' },
    ];

    const seededCategories: ProductCategory[] = [];
    for (const data of categoriesData) {
      let category = await this.categoryRepository.findOne({ where: { slug: data.slug } });
      if (!category) {
        category = this.categoryRepository.create({
          ...data,
          image_url: 'images/logo/logo.png',
          sort_order: seededCategories.length + 1,
          is_active: true,
        });
        category = await this.categoryRepository.save(category);
      }
      seededCategories.push(category);
    }
    return seededCategories;
  }

  private async seedProducts(categories: ProductCategory[]): Promise<void> {
    const originalCat = categories.find((c) => c.slug === 'original-popcorn');
    const sweetCat = categories.find((c) => c.slug === 'sweet-popcorn');
    const spicyCat = categories.find((c) => c.slug === 'spicy-popcorn');

    const productsData = [
      {
        name: 'Malmil Original Popcorn',
        slug: 'malmil-original-popcorn',
        description: 'Popcorn premium dengan mentega gurih alami, dibuat tanpa bahan pengawet.',
        base_price: 30000,
        weight_grams: 100,
        category: originalCat,
        is_featured: true,
        variants: [
          { sku: 'MLM-ORIG-50', name: '50g', price_override: 18000, weight_grams: 50, stock_qty: 100 },
          { sku: 'MLM-ORIG-100', name: '100g', price_override: 30000, weight_grams: 100, stock_qty: 150 },
          { sku: 'MLM-ORIG-200', name: '200g', price_override: 55000, weight_grams: 200, stock_qty: 80 },
        ],
      },
      {
        name: 'Malmil Sweet Caramel',
        slug: 'malmil-sweet-caramel',
        description: 'Popcorn manis berlapis saus karamel premium khas Malmil yang kaya rasa.',
        base_price: 35000,
        weight_grams: 100,
        category: sweetCat,
        is_featured: true,
        variants: [
          { sku: 'MLM-CARM-50', name: '50g', price_override: 20000, weight_grams: 50, stock_qty: 120 },
          { sku: 'MLM-CARM-100', name: '100g', price_override: 35000, weight_grams: 100, stock_qty: 200 },
          { sku: 'MLM-CARM-200', name: '200g', price_override: 65000, weight_grams: 200, stock_qty: 90 },
        ],
      },
      {
        name: 'Malmil Spicy Balado',
        slug: 'malmil-spicy-balado',
        description: 'Perpaduan popcorn renyah dengan bumbu balado khas nusantara yang pedas manis.',
        base_price: 32000,
        weight_grams: 100,
        category: spicyCat,
        is_featured: false,
        variants: [
          { sku: 'MLM-SPIC-50', name: '50g', price_override: 19000, weight_grams: 50, stock_qty: 90 },
          { sku: 'MLM-SPIC-100', name: '100g', price_override: 32000, weight_grams: 100, stock_qty: 180 },
          { sku: 'MLM-SPIC-200', name: '200g', price_override: 60000, weight_grams: 200, stock_qty: 70 },
        ],
      },
    ];

    for (const data of productsData) {
      let product = await this.productRepository.findOne({ where: { slug: data.slug } });
      if (!product) {
        const { variants, ...prodData } = data;
        product = this.productRepository.create({
          ...prodData,
          meta_title: data.name,
          meta_description: data.description.substring(0, 150),
          is_active: true,
          sort_order: 1,
        });
        product = await this.productRepository.save(product);

        // Seed variants
        for (const variantData of variants) {
          const variant = this.variantRepository.create({
            ...variantData,
            product,
            is_active: true,
          });
          await this.variantRepository.save(variant);
        }

        // Seed primary image
        const image = this.imageRepository.create({
          product,
          url: 'images/logo/logo.png',
          alt_text: product.name,
          is_primary: true,
          sort_order: 1,
        });
        await this.imageRepository.save(image);
      }
    }
  }

  private async seedCoupons(): Promise<void> {
    const now = new Date();
    const expiry = new Date();
    expiry.setFullYear(now.getFullYear() + 1);

    const couponsData = [
      {
        code: 'MALMIL10',
        type: CouponType.PERCENTAGE,
        value: 10,
        min_order: 50000,
        max_discount: 15000,
        usage_limit: 1000,
        starts_at: now,
        expires_at: expiry,
        is_active: true,
      },
      {
        code: 'MALMILFREE',
        type: CouponType.FIXED,
        value: 10000,
        min_order: 100000,
        usage_limit: 500,
        starts_at: now,
        expires_at: expiry,
        is_active: true,
      },
    ];

    for (const data of couponsData) {
      const existing = await this.couponRepository.findOne({ where: { code: data.code } });
      if (!existing) {
        await this.couponRepository.save(this.couponRepository.create(data));
      }
    }
  }

  private async seedBanners(): Promise<void> {
    const now = new Date();
    const expiry = new Date();
    expiry.setFullYear(now.getFullYear() + 1);

    const bannersData = [
      {
        title: 'Malmil Popcorn Premium',
        subtitle: 'Nikmati cemilan seru setiap hari dengan rasa lezat original, manis, dan pedas!',
        image_url: 'images/logo/logo.png',
        link_url: '/catalog',
        position: 'hero',
        sort_order: 1,
        is_active: true,
        starts_at: now,
        expires_at: expiry,
      },
      {
        title: 'Promo Spesial 10%',
        subtitle: 'Gunakan kupon MALMIL10 untuk pembelian minimal Rp50.000!',
        image_url: 'images/logo/logo.png',
        link_url: '/catalog',
        position: 'hero',
        sort_order: 2,
        is_active: true,
        starts_at: now,
        expires_at: expiry,
      },
    ];

    for (const data of bannersData) {
      const existing = await this.bannerRepository.findOne({ where: { title: data.title } });
      if (!existing) {
        await this.bannerRepository.save(this.bannerRepository.create(data));
      }
    }
  }

  private async seedSettings(): Promise<void> {
    const settingsData = [
      { key: 'wa_number', value: process.env.WA_NUMBER || '6281234567890', group: 'social' },
      { key: 'instagram_url', value: process.env.INSTAGRAM_URL || 'https://instagram.com/malmil.id', group: 'social' },
      { key: 'site_name', value: 'Malmil', group: 'general' },
      { key: 'site_description', value: 'Premium Popcorn Indonesia', group: 'general' },
    ];

    for (const data of settingsData) {
      const existing = await this.settingRepository.findOne({ where: { key: data.key } });
      if (!existing) {
        await this.settingRepository.save(this.settingRepository.create(data));
      }
    }
    this.logger.log(`Seeded ${settingsData.length} settings`);
  }
}
