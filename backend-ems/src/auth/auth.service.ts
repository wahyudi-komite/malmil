import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { randomBytes, createHash } from 'crypto';
import { UsersService } from '../users/users.service';
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
  async generateRefreshToken(userId: number): Promise<string> {
    const raw = randomBytes(48).toString('hex');
    const hash = createHash('sha256').update(raw).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await this.refreshTokenRepository.save({
      tokenHash: hash,
      user: { id: userId } as any,
      expiresAt,
    });
    return raw;
  }

  /** Validate a raw refresh token, returns entity or null */
  async validateRefreshToken(rawToken: string): Promise<RefreshToken | null> {
    const hash = createHash('sha256').update(rawToken).digest('hex');
    const token = await this.refreshTokenRepository.findOne({
      where: { tokenHash: hash, isRevoked: false },
      relations: ['user'],
    });
    if (!token) return null;
    if (token.expiresAt < new Date()) return null;
    return token;
  }

  /** Revoke a refresh token by its id */
  async revokeRefreshToken(id: string): Promise<void> {
    await this.refreshTokenRepository.update(id, { isRevoked: true });
  }


  // In‑memory revoked refresh‑token IDs (JTI)
  private readonly revokedTokens = new Set<string>();

  // Generate a unique JWT ID (jti) for refresh tokens
  generateJti(): string {
    return randomBytes(16).toString('hex');
  }

  // Generate a CSRF double‑submit token
  generateCsrfToken(): string {
    return randomBytes(24).toString('hex');
  }

  // Revoke a refresh token by its jti
  revokeToken(jti: string): void {
    this.revokedTokens.add(jti);
  }

  // Check if a refresh token jti has been revoked
  isTokenRevoked(jti: string): boolean {
    return this.revokedTokens.has(jti);
  }

  // Extract the jti from a refresh token (if any)
  extractJti(token: string): string | undefined {
    const decoded = this.jwtService.decode(token) as any;
    return decoded?.jti;
  }

  // Helper to get user ID from a request (used by guards)
  async userId(request: Request): Promise<number> {
    const cookie = request.cookies['fms_token_data'];
    const data = await this.jwtService.verifyAsync(cookie);
    return data['id'];
  }

  // Sign in using an existing access token and issue a fresh access token
  async signInWithToken(token: string): Promise<{ user: any; newToken: string; payload: any }> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException('User tidak ditemukan');
      }
      const newToken = this.jwtService.sign({ id: user.id });
      return { user, newToken, payload };
    } catch (err) {
      throw new UnauthorizedException('Token tidak valid atau kadaluarsa');
    }
  }
}
