import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('newsletter_subscribers')
export class NewsletterSubscriber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ length: 200 })
  email: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  subscribed_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  unsubscribed_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
