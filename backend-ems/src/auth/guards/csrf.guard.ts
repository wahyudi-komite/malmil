import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const csrfHeader = request.headers['x-xsrf-token'];
    const csrfCookie = request.cookies['XSRF-TOKEN'];
    // Simple double‑submit check – in production you may want a stronger validation
    if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
      throw new UnauthorizedException('CSRF token missing or invalid');
    }
    return true;
  }
}
