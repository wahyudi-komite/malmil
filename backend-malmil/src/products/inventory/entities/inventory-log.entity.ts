import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductVariant } from '../../entities/product-variant.entity';

@Entity('inventory_logs')
export class InventoryLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => ProductVariant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @Column()
  change_qty: number;

  @Column({ length: 50 })
  reason: string; // 'order_placed', 'order_cancelled', 'manual_adjustment', 'restock'

  @Column({ length: 50, nullable: true })
  reference_type: string; // 'order', 'manual'

  @Column({ length: 100, nullable: true })
  reference_id: string;

  @CreateDateColumn()
  created_at: Date;
}
