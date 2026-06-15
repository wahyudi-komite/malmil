import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => ProductVariant, { nullable: true })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  // Denormalized snapshot at time of order
  @Column({ length: 200 })
  product_name: string;

  @Column({ length: 100 })
  variant_name: string;

  @Column({ type: 'decimal', precision: 12, scale: 0 })
  price: number;

  @Column()
  quantity: number;

  @Column({ default: 0 })
  weight_grams: number;

  @CreateDateColumn()
  created_at: Date;
}
