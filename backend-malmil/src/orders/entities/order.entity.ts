import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ShippingAddress } from '../../shipping/entities/shipping-address.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum OrderStatus {
  PENDING = 'pending',
  WAITING_PAYMENT = 'waiting_payment',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ length: 30 })
  order_number: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ShippingAddress, { nullable: true, eager: true })
  @JoinColumn({ name: 'address_id' })
  address: ShippingAddress;

  @Column({ length: 50, nullable: true })
  coupon_code: string;

  @Column({ type: 'decimal', precision: 12, scale: 0, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 0, default: 0 })
  shipping_cost: number;

  @Column({ type: 'decimal', precision: 12, scale: 0, default: 0 })
  discount_amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 0, default: 0 })
  total: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Shipping info
  @Column({ length: 100, nullable: true })
  tracking_number: string;

  @Column({ length: 30, nullable: true })
  courier_code: string;

  @Column({ length: 50, nullable: true })
  courier_service: string;

  @Column({ type: 'timestamp', nullable: true })
  shipped_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  delivered_at: Date;

  // Guest customer info
  @Column({ length: 100, nullable: true })
  guest_name: string;

  @Column({ length: 100, nullable: true })
  guest_email: string;

  @Column({ length: 20, nullable: true })
  guest_phone: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: true })
  items: OrderItem[];

  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
