import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ length: 30 })
  code: string;

  @Column({ type: 'enum', enum: CouponType, default: CouponType.PERCENTAGE })
  type: CouponType;

  @Column({ type: 'decimal', precision: 12, scale: 0 })
  value: number; // percentage (e.g., 10) or fixed amount (e.g., 10000)

  @Column({ type: 'decimal', precision: 12, scale: 0, default: 0 })
  min_order: number;

  @Column({ type: 'decimal', precision: 12, scale: 0, nullable: true })
  max_discount: number; // Only for percentage type

  @Column({ nullable: true })
  usage_limit: number;

  @Column({ default: 0 })
  used_count: number;

  @Column({ type: 'timestamp', nullable: true })
  starts_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date;

  @Index()
  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
