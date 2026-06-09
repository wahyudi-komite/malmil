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
    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('accessToken', jwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return { accessToken: jwt, user: user };
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

  // @UseGuards(AuthGuard)
  @Post('refresh')
  @UseGuards(CsrfGuard)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch (e) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const jti = this.authService.extractJti(refreshToken);
    if (jti && this.authService.isTokenRevoked(jti)) {
      return res.status(401).json({ message: 'Refresh token revoked' });
    }

    // Issue new access token
    const newAccessToken = this.jwtService.sign({ id: payload.id });

    // Rotate refresh token
    const newRefreshToken = this.jwtService.sign({ id: payload.id }, { expiresIn: '30d', jwtid: this.authService.generateJti() });
    const newCsrfToken = this.authService.generateCsrfToken();

    // Revoke old refresh token
    if (jti) this.authService.revokeToken(jti);

    // Set new cookies
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
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
