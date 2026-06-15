import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductCategory } from './entities/product-category.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(ProductCategory)
    private readonly categoryRepo: Repository<ProductCategory>,
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,
    @InjectRepository(ProductImage)
    private readonly imageRepo: Repository<ProductImage>,
  ) {}

  // ─── Public Catalog ───────────────────────────────

  async findAllPublic(query: ProductQueryDto) {
    const take = query.limit || 12;
    const page = query.page || 1;

    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.variants', 'variants')
      .where('product.is_active = :active', { active: true });

    // Filter by category slug
    if (query.category) {
      qb.andWhere('category.slug = :catSlug', { catSlug: query.category });
    }

    // Filter featured
    if (query.is_featured) {
      qb.andWhere('product.is_featured = :featured', { featured: true });
    }

    // Search
    if (query.keyword) {
      qb.andWhere(
        new Brackets((qb2) => {
          qb2.where('product.name LIKE :kw', { kw: `%${query.keyword}%` })
            .orWhere('product.description LIKE :kw', { kw: `%${query.keyword}%` });
        }),
      );
    }

    // Sorting
    switch (query.sort) {
      case 'price_asc':
        qb.orderBy('product.base_price', 'ASC');
        break;
      case 'price_desc':
        qb.orderBy('product.base_price', 'DESC');
        break;
      case 'name_asc':
        qb.orderBy('product.name', 'ASC');
        break;
      case 'newest':
      default:
        qb.orderBy('product.created_at', 'DESC');
        break;
    }

    qb.take(take).skip((page - 1) * take);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
        pageSize: take,
      },
    };
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { slug, is_active: true },
      relations: ['category', 'images', 'variants'],
    });
    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }
    return product;
  }

  async findFeatured(limit = 8): Promise<Product[]> {
    return this.productRepo.find({
      where: { is_active: true, is_featured: true },
      relations: ['images', 'variants'],
      order: { sort_order: 'ASC' },
      take: limit,
    });
  }

  // ─── Admin CRUD ────────────────────────────────────

  async findAllAdmin(query: any) {
    const take = query.limit || 20;
    const page = query.page || 1;

    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.variants', 'variants');

    if (query.keyword) {
      qb.andWhere(
        new Brackets((qb2) => {
          qb2.where('product.name LIKE :kw', { kw: `%${query.keyword}%` })
            .orWhere('product.slug LIKE :kw', { kw: `%${query.keyword}%` });
        }),
      );
    }

    qb.orderBy('product.created_at', 'DESC')
      .take(take)
      .skip((page - 1) * take);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: { total, page, last_page: Math.ceil(total / take), pageSize: take },
    };
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const slug = this.generateSlug(dto.name);

    // Check slug uniqueness
    const existing = await this.productRepo.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Produk dengan slug "${slug}" sudah ada`);
    }

    const product = this.productRepo.create({
      ...dto,
      slug,
      category: dto.category_id ? { id: dto.category_id } as any : null,
    });

    return this.productRepo.save(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['images', 'variants'],
    });
    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    if (dto.name && dto.name !== product.name) {
      product.slug = this.generateSlug(dto.name);
    }

    Object.assign(product, dto);

    if (dto.category_id) {
      product.category = { id: dto.category_id } as any;
    }

    // Handle images update if provided
    if (dto.images) {
      await this.imageRepo.delete({ product: { id } });
      product.images = dto.images.map((img) => this.imageRepo.create({ ...img, product: { id } as any }));
    }

    // Handle variants update if provided
    if (dto.variants) {
      await this.variantRepo.delete({ product: { id } });
      product.variants = dto.variants.map((v) => this.variantRepo.create({ ...v, product: { id } as any }));
    }

    return this.productRepo.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }
    await this.productRepo.remove(product);
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'images', 'variants'],
    });
    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }
    return product;
  }

  // ─── Categories ────────────────────────────────────

  async findAllCategories(): Promise<ProductCategory[]> {
    return this.categoryRepo.find({
      where: { is_active: true },
      order: { sort_order: 'ASC' },
    });
  }

  async findAllCategoriesAdmin(): Promise<ProductCategory[]> {
    return this.categoryRepo.find({
      order: { sort_order: 'ASC' },
    });
  }

  async createCategory(data: Partial<ProductCategory>): Promise<ProductCategory> {
    const slug = this.generateSlug(data.name);
    const category = this.categoryRepo.create({ ...data, slug });
    return this.categoryRepo.save(category);
  }

  async updateCategory(id: string, data: Partial<ProductCategory>): Promise<ProductCategory> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }
    if (data.name) {
      data.slug = this.generateSlug(data.name);
    }
    Object.assign(category, data);
    return this.categoryRepo.save(category);
  }

  async removeCategory(id: string): Promise<void> {
    const result = await this.categoryRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }
  }

  // ─── Helpers ───────────────────────────────────────

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
