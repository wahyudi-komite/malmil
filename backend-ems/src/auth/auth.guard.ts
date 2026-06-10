import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    try {
      const jwt = request.cookies['accessToken'];
      if (!jwt) {
        throw new UnauthorizedException('Authentication required');
      }
      request.user = await this.jwtService.verifyAsync(jwt);
      return true;
    } catch {
      throw new UnauthorizedException('Authentication required');
    }
  }
}
