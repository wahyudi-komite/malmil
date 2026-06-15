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
  ConflictException,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { PasswordResetService } from './password-reset.service';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { CsrfGuard } from './guards/csrf.guard';
import { AuditService } from '../audit/audit.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password-reset.dto';

@Controller('auth')
export class AuthController {
  private readonly accessTokenMaxAge = 15 * 60 * 1000;
  private readonly refreshTokenMaxAge = 30 * 24 * 60 * 60 * 1000;

  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
    private readonly rolesService: RolesService,
    private jwtService: JwtService,
    private readonly auditService: AuditService,
    private readonly passwordResetService: PasswordResetService,
    private readonly mailService: MailService,
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

  @UseInterceptors(ClassSerializerInterceptor)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('sign-up')
  async register(
    @Body() dto: SignUpDto,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const existing = await this.userService.findOne({ email: dto.email });
    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const customerRole = await this.rolesService.findOne({ name: 'customer' });
    const hashed = await bcrypt.hash(dto.password, 12);

    const user = await this.userService.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
      phone: null,
      is_active: true,
      role: customerRole ? { id: customerRole.id } : undefined,
    });

    this.auditService.log(user.id, user.email, 'REGISTER', 'auth', user.id, 'User registered', req.ip);

    // Send verification email (fire-and-forget)
    this.sendVerificationEmail(user.id, user.email);

    // Auto-login after registration
    const accessJwt = await this.authService.issueAccessToken(user.id);
    this.setAccessTokenCookie(response, accessJwt);

    const rawRefresh = await this.authService.generateRefreshToken(user.id);
    this.setRefreshTokenCookie(response, rawRefresh);

    const csrfToken = this.authService.generateCsrfToken();
    this.setCsrfCookie(response, csrfToken);

    return { user };
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
  // Note: CsrfGuard intentionally omitted here because the auth interceptor
  // cannot reliably send a valid XSRF-TOKEN on refresh (the CSRF cookie expires
  // at the same time as the access token). Refresh tokens are httpOnly + rotated.
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post('refresh')
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

  private async sendVerificationEmail(userId: string, email: string) {
    try {
      const token = this.jwtService.sign(
        { id: userId, purpose: 'email-verification' },
        { expiresIn: '24h' },
      );
      await this.mailService.sendEmailVerification(email, token);
    } catch (e) {
      this.auditService.log(userId, email, 'VERIFICATION_EMAIL_FAILED', 'auth', userId, 'Failed to send verification email', 'system');
    }
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto, @Req() req: Request) {
    const user = await this.userService.findOne({ email: dto.email });
    if (user) {
      await this.passwordResetService.sendResetLink(dto.email);
      this.auditService.log(user.id, dto.email, 'FORGOT_PASSWORD', 'auth', user.id, 'Password reset requested', req.ip);
    }
    return { message: 'Jika email terdaftar, link reset password telah dikirim' };
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req: Request) {
    const record = await this.passwordResetService.validateToken(dto.token);
    if (!record) {
      throw new BadRequestException('Token tidak valid atau sudah kadaluarsa');
    }
    const user = await this.userService.findOne({ email: record.email });
    if (!user) {
      throw new BadRequestException('User tidak ditemukan');
    }
    const hashed = await bcrypt.hash(dto.password, 12);
    await this.userService.update(user.id, { password: hashed });
    await this.passwordResetService.markUsed(record.id);
    await this.authService.revokeAllUserRefreshTokens(user.id);

    this.auditService.log(user.id, record.email, 'RESET_PASSWORD', 'auth', user.id, 'Password reset successful', req.ip);
    return { message: 'Password berhasil direset. Silakan login dengan password baru.' };
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('verify-email')
  async verifyEmail(@Body('token') token: string, @Req() req: Request) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (payload.purpose !== 'email-verification') {
        throw new BadRequestException('Token tidak valid');
      }
      await this.userService.update(payload.id, { email_verified_at: new Date() });
      this.auditService.log(payload.id, 'unknown', 'VERIFY_EMAIL', 'auth', payload.id, 'Email verified', req.ip);
      return { message: 'Email berhasil diverifikasi' };
    } catch {
      throw new BadRequestException('Token verifikasi tidak valid atau sudah kadaluarsa');
    }
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('send-verification')
  async sendVerification(@Body('userId') userId: string, @Req() req: Request) {
    const user = await this.userService.findById(userId);
    if (!user) throw new BadRequestException('User tidak ditemukan');
    if (user.email_verified_at) return { message: 'Email sudah diverifikasi' };
    await this.sendVerificationEmail(userId, user.email);
    this.auditService.log(userId, user.email, 'RESEND_VERIFICATION', 'auth', userId, 'Verification email resent', req.ip);
    return { message: 'Email verifikasi telah dikirim' };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const profile = req.user as any;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

    if (!profile?.email) {
      return res.redirect(`${frontendUrl}/sign-in?error=google_no_email`);
    }

    let user = await this.userService.findOne({ email: profile.email });

    if (!user) {
      const customerRole = await this.rolesService.findOne({ name: 'customer' });
      user = await this.userService.create({
        name: profile.name,
        email: profile.email,
        password: null,
        phone: null,
        is_active: true,
        avatar: profile.avatar,
        email_verified_at: new Date(),
        role: customerRole ? { id: customerRole.id } : undefined,
      });
    }

    this.auditService.log(user.id, user.email, 'LOGIN', 'auth', null, 'Google OAuth login', req.ip);

    const accessJwt = await this.authService.issueAccessToken(user.id);
    this.setAccessTokenCookie(res, accessJwt);

    const rawRefresh = await this.authService.generateRefreshToken(user.id);
    this.setRefreshTokenCookie(res, rawRefresh);

    const csrfToken = this.authService.generateCsrfToken();
    this.setCsrfCookie(res, csrfToken);

    return res.redirect(`${frontendUrl}/signed-in-redirect`);
  }
}
