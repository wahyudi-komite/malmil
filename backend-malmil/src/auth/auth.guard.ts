import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private readonly auditService: AuditService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    try {
      const jwt = request.cookies['accessToken'];
      if (!jwt) {
        throw new UnauthorizedException('Authentication required');
      }
      request.user = await this.jwtService.verifyAsync(jwt);
      return true;
    } catch (error) {
      this.auditService.log('SYSTEM', request.ip, 'AUTH_GUARD_FAIL', 'auth', null, 'JWT verification failed or missing', request.ip);
      throw new UnauthorizedException('Authentication required');
    }
  }
}
