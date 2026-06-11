import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const access = this.reflector.get<string[]>('access', context.getHandler());
    if (!access || access.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissions) {
      return false;
    }

    const resource = access[0];

    if (request.method === 'GET') {
      return user.permissions.includes(`${resource}_view`);
    }

    return (
      user.permissions.includes(`${resource}_create`) ||
      user.permissions.includes(`${resource}_edit`) ||
      user.permissions.includes(`${resource}_delete`)
    );
  }
}
