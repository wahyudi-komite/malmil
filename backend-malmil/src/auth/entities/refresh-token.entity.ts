import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  /** Foreign key to user */
  @Column({ name: 'user_id' })
  userId: string;

  /** Expiration date – same as cookie max‑age (30 days) */
  @Column()
  expiresAt: Date;

  /** Flag for revocation (soft‑delete) */
  @Column({ default: false })
  isRevoked: boolean;

  /** Token family ID for reuse detection */
  @Column({ nullable: true })
  familyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
