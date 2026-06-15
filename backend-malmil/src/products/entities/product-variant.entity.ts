import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Index({ unique: true })
  @Column({ length: 50 })
  sku: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 12, scale: 0, nullable: true })
  price_override: number;

  @Column({ default: 0 })
  weight_grams: number;

  @Index()
  @Column({ default: 0 })
  stock_qty: number;

  @Column({ default: 5 })
  low_stock_threshold: number;

  @Index()
  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
