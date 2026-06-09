import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * Stores a hashed version of a refresh token.
 * The raw token is sent to the client in an HttpOnly cookie.
 * Only the hash is persisted to prevent token leakage from the DB.
 */
@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** SHA‑256 hash of the raw refresh token */
  @Column({ length: 64 })
  tokenHash: string;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  user: User;

  /** Expiration date – same as cookie max‑age (30 days) */
  @Column()
  expiresAt: Date;

  /** Flag for revocation (soft‑delete) */
  @Column({ default: false })
  isRevoked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
