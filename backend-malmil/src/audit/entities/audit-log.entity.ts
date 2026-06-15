import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  userEmail: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  resource: string;

  @Column({ nullable: true })
  resourceId: string;

  @Column({ type: 'text', nullable: true })
  detail: string;

  @Column({ nullable: true })
  ip: string;

  @CreateDateColumn()
  createdAt: Date;
}
