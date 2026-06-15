import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('banners')
export class Banner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 300, nullable: true })
  subtitle: string;

  @Column({ length: 500 })
  image_url: string;

  @Column({ length: 500, nullable: true })
  link_url: string;

  @Index()
  @Column({ length: 30, default: 'hero' })
  position: string; // 'hero', 'promo_bar', 'sidebar'

  @Column({ default: 0 })
  sort_order: number;

  @Index()
  @Column({ default: true })
  is_active: boolean;

  @Index()
  @Column({ type: 'timestamp', nullable: true })
  starts_at: Date;

  @Index()
  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
