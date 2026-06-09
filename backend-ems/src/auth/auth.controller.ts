import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  NotFoundException,
  BadRequestException,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { CsrfGuard } from './guards/csrf.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Get('check-auth')
  async checkAuth(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['accessToken'];

    if (!token) {
      return res.json({ isAuthenticated: false });
    }

    try {
      // Verifikasi token
      this.jwtService.verify(token);
      const { user, newToken } = await this.authService.signInWithToken(token);
      // Jika verifikasi berhasil, user terotentikasi
      res.json({ isAuthenticated: true, user: user, accessToken: newToken });
    } catch (error) {
      // Jika terjadi error saat verifikasi, token tidak valid
      res.json({ isAuthenticated: false });
    }
  }

  // Sign-in endpoint – generate access and refresh tokens, store refresh token hash
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('sign-in')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userService.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!(await bcrypt.compare(user.salt + password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }
    const accessJwt = await this.jwtService.signAsync({ id: user.id });
    // Store access token in HttpOnly cookie (optional) – here we keep existing logic
    response.cookie('accessToken', accessJwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Generate and store refresh token in DB
    const rawRefresh = await this.authService.generateRefreshToken(user.id);
    response.cookie('refreshToken', rawRefresh, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // CSRF token for double‑submit
    const csrfToken = this.authService.generateCsrfToken();
    response.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
    });

    return { accessToken: accessJwt, user: user };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('sign-in-with-token')
  async signInWithToken(@Body('accessToken') token: string, @Res() res: Response) {
    if (!token) {
      throw new UnauthorizedException('Token tidak disediakan');
    }

    try {
      const { user, newToken, payload } = await this.authService.signInWithToken(token);
      
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d', jwtid: this.generateJti() });
      const csrfToken = this.generateCsrfToken();
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      
      res.cookie('XSRF-TOKEN', csrfToken, {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      });

      return res.json({ accessToken: newToken, user: user });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  // Refresh endpoint – validate DB‑stored refresh token, rotate, revoke old
  @Post('refresh')
  @UseGuards(CsrfGuard)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const rawRefresh = req.cookies['refreshToken'];
    if (!rawRefresh) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }
    const stored = await this.authService.validateRefreshToken(rawRefresh);
    if (!stored) {
      return res.status(401).json({ message: 'Invalid or revoked refresh token' });
    }
    // Rotate token
    const userId = stored.user.id;
    // Revoke old token record
    await this.authService.revokeRefreshToken(stored.id);
    // Issue new refresh token and store
    const newRawRefresh = await this.authService.generateRefreshToken(userId);
    // Issue new access token
    const newAccessToken = this.jwtService.sign({ id: userId });

    // Set new cookies
    res.cookie('refreshToken', newRawRefresh, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    const newCsrfToken = this.authService.generateCsrfToken();
    res.cookie('XSRF-TOKEN', newCsrfToken, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
    });
    return res.json({ accessToken: newAccessToken });
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (refreshToken) {
      const jti = this.authService.extractJti(refreshToken);
      if (jti) this.authService.revokeToken(jti);
    }
    response.clearCookie('refreshToken');
    response.clearCookie('accessToken');
    return { message: 'Success' };
  }
}
