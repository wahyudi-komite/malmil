import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, response } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async userId(request: Request): Promise<number> {
    const cookie = request.cookies['fms_token_data'];

    const data = await this.jwtService.verifyAsync(cookie);

    return data['id'];
  }

  async signInWithToken(
    token: string,
  ): Promise<{ user: any; newToken: string }> {
    try {
      // Verifikasi token
      const payload = this.jwtService.verify(token);

      // Cari user berdasarkan informasi dalam payload
      const user = await this.userService.findById(payload.id);

      if (!user) {
        throw new UnauthorizedException('User tidak ditemukan');
      }

      // Buat token baru
      const newToken = this.jwtService.sign({
        id: user.id,
      });

      return { user, newToken };
    } catch (error) {
      throw new UnauthorizedException('Token tidak valid atau kadaluarsa');
    }
  }
}
