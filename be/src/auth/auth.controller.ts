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
    response.cookie('accessToken', jwt, { httpOnly: true });

    return { accessToken: jwt, user: user };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('sign-in-with-token')
  async signInWithToken(@Body('accessToken') token: string) {
    if (!token) {
      throw new UnauthorizedException('Token tidak disediakan');
    }

    try {
      const { user, newToken } = await this.authService.signInWithToken(token);

      return {
        message: 'Sign in berhasil',
        user: user,
        accessToken: newToken,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  // @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('accessToken');
    return {
      message: 'Success',
    };
  }
}
