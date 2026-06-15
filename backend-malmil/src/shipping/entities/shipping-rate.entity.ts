import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity('shipping_rates')
export class ShippingRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => Order, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ length: 30 })
  courier_code: string;

  @Column({ length: 50 })
  service_type: string;

  @Column({ type: 'decimal', precision: 12, scale: 0 })
  cost: number;

  @Column({ length: 30, nullable: true })
  etd: string; // e.g., '2-3 hari'

  @Column({ default: false })
  selected: boolean;

  @CreateDateColumn()
  created_at: Date;
}
