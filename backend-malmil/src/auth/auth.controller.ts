import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { CsrfGuard } from './guards/csrf.guard';
import { AuditService } from '../audit/audit.service';

@Controller('auth')
export class AuthController {
  private readonly accessTokenMaxAge = 15 * 60 * 1000;
  private readonly refreshTokenMaxAge = 30 * 24 * 60 * 60 * 1000;

  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
    private jwtService: JwtService,
    private readonly auditService: AuditService,
  ) {}

  private setAccessTokenCookie(response: Response, accessToken: string): void {
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: this.accessTokenMaxAge,
    });
  }

  private setRefreshTokenCookie(response: Response, refreshToken: string): void {
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: this.refreshTokenMaxAge,
    });
  }

  private setCsrfCookie(response: Response, csrfToken: string): void {
    response.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      maxAge: this.accessTokenMaxAge,
    });
  }

  private clearAuthCookies(response: Response): void {
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    response.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    response.clearCookie('XSRF-TOKEN', {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
    });
  }

  @Get('check-auth')
  async checkAuth(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['accessToken'];

    if (!token) {
      return { isAuthenticated: false };
    }

    try {
      const user = await this.authService.userFromAccessToken(token);
      const newToken = await this.authService.issueAccessToken(user.id);
      this.setAccessTokenCookie(res, newToken);
      return { isAuthenticated: true, user };
    } catch {
      this.clearAuthCookies(res);
      return { isAuthenticated: false };
    }
  }

  // Sign-in endpoint – generate access and refresh tokens, store refresh token hash
  @UseInterceptors(ClassSerializerInterceptor)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('sign-in')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.findOne(
      { email: email },
      ['role', 'role.permissions'],
    );
    if (!user || !(await bcrypt.compare(password, user.password))) {
      await this.auditService.log('SYSTEM', email, 'LOGIN_FAILED', 'auth', null, 'Invalid credentials', req.ip);
      throw new UnauthorizedException('Invalid credentials');
    }
    this.auditService.log(user.id, email, 'LOGIN', 'auth', null, 'Login success', req.ip);

    const accessJwt = await this.authService.issueAccessToken(user.id);
    this.setAccessTokenCookie(response, accessJwt);

    const rawRefresh = await this.authService.generateRefreshToken(user.id);
    this.setRefreshTokenCookie(response, rawRefresh);

    const csrfToken = this.authService.generateCsrfToken();
    this.setCsrfCookie(response, csrfToken);

    return { user };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(CsrfGuard)
  @Post('sign-in-with-token')
  async signInWithToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['accessToken'];
    if (!token) {
      throw new UnauthorizedException('Token tidak disediakan');
    }

    try {
      const { user, newToken } = await this.authService.signInWithToken(token);
      this.auditService.log(user.id, user.email, 'TOKEN_SIGN_IN', 'auth', null, 'Re-authenticated via token', req.ip);
      this.setAccessTokenCookie(res, newToken);

      const rawRefresh = await this.authService.generateRefreshToken(user.id);
      this.setRefreshTokenCookie(res, rawRefresh);

      const csrfToken = this.authService.generateCsrfToken();
      this.setCsrfCookie(res, csrfToken);

      return { user };
    } catch {
      throw new UnauthorizedException('Token tidak valid atau kadaluarsa');
    }
  }

  // Refresh endpoint – validate DB‑stored refresh token, rotate, revoke old
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post('refresh')
  @UseGuards(CsrfGuard)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const rawRefresh = req.cookies['refreshToken'];
    if (!rawRefresh) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }
    const result = await this.authService.validateRefreshToken(rawRefresh);
    if (!result) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    const { token: stored, isReused } = result;

    if (isReused) {
      this.auditService.log(stored.userId, 'unknown', 'TOKEN_REUSE', 'auth', null, 'Token reuse detected, family revoked', req.ip);
      // Token reuse detected – revoke entire family, force logout
      this.clearAuthCookies(res);
      return res
        .status(401)
        .json({ message: 'Token reuse detected, all sessions revoked' });
    }

    // Rotate token
    const userId = stored.userId;
    // Revoke old token record
    await this.authService.revokeRefreshToken(stored.id);
    // Issue new refresh token in the same family
    const newRawRefresh = await this.authService.generateRefreshToken(
      userId,
      stored.familyId,
    );
    // Issue new access token
    const newAccessToken = await this.authService.issueAccessToken(userId);

    this.auditService.log(userId, 'unknown', 'TOKEN_REFRESH', 'auth', null, 'Token refreshed', req.ip);

    // Cleanup expired tokens (fire-and-forget)
    this.authService.cleanupExpiredTokens();

    // Set new cookies
    this.setAccessTokenCookie(res, newAccessToken);
    this.setRefreshTokenCookie(res, newRawRefresh);
    const newCsrfToken = this.authService.generateCsrfToken();
    this.setCsrfCookie(res, newCsrfToken);
    return res.json({ success: true });
  }

  @Post('logout')
  @UseGuards(CsrfGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (refreshToken) {
      const result = await this.authService.validateRefreshToken(refreshToken);
      if (result && !result.isReused) {
        await this.authService.revokeRefreshToken(result.token.id);
      }
    }
    this.clearAuthCookies(response);
    return { message: 'Success' };
  }
}
