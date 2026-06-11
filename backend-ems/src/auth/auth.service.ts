import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, createHash } from 'crypto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  /** Generate a raw refresh token and persist its hash */
  async generateRefreshToken(
    userId: string,
    familyId?: string,
  ): Promise<string> {
    const raw = randomBytes(48).toString('hex');
    const hash = createHash('sha256').update(raw).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await this.refreshTokenRepository.save({
      tokenHash: hash,
      userId,
      expiresAt,
      familyId: familyId ?? randomBytes(16).toString('hex'),
    });
    return raw;
  }

  /** Validate a raw refresh token. Returns null for invalid/expired/reused tokens. */
  async validateRefreshToken(
    rawToken: string,
  ): Promise<{ token: RefreshToken; isReused: boolean } | null> {
    const hash = createHash('sha256').update(rawToken).digest('hex');
    const token = await this.refreshTokenRepository.findOne({
      where: { tokenHash: hash },
    });
    if (!token) return null;
    if (token.expiresAt < new Date()) return null;

    if (token.isRevoked) {
      // Reuse detected – revoke entire token family
      if (token.familyId) {
        await this.refreshTokenRepository.update(
          { familyId: token.familyId, isRevoked: false },
          { isRevoked: true },
        );
      }
      return { token, isReused: true };
    }

    return { token, isReused: false };
  }

  /** Revoke a refresh token by its id */
  async revokeRefreshToken(id: string): Promise<void> {
    await this.refreshTokenRepository.update(id, { isRevoked: true });
  }

  /** Revoke all active refresh tokens for a user (e.g., on password change) */
  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }

  /** Remove expired refresh tokens from DB */
  async cleanupExpiredTokens(): Promise<void> {
    await this.refreshTokenRepository
      .createQueryBuilder()
      .delete()
      .where('expiresAt < :now', { now: new Date() })
      .execute();
  }

  /** Generate a CSRF double‑submit token */
  generateCsrfToken(): string {
    return randomBytes(24).toString('hex');
  }

  async issueAccessToken(userId: string): Promise<string> {
    const user = await this.userService.findOne(
      { id: userId },
      { role: { permissions: true } },
    );
    const payload: Record<string, any> = { id: userId };
    if (user?.role) {
      payload.role = user.role.name;
      payload.permissions = (user.role.permissions ?? []).map(
        (p: any) => p.name,
      );
    }
    return this.jwtService.sign(payload);
  }

  async userFromAccessToken(token: string): Promise<User> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.userService.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException('User tidak ditemukan');
      }
      return user;
    } catch {
      throw new UnauthorizedException('Token tidak valid atau kadaluarsa');
    }
  }

  // Sign in using an existing access token and issue a fresh access token
  async signInWithToken(token: string): Promise<{ user: any; newToken: string }> {
    const user = await this.userFromAccessToken(token);
    const newToken = await this.issueAccessToken(user.id);
    return { user, newToken };
  }
}
