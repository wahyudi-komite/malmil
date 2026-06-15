import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { HasPermission } from '../permissions/has-permission.decorator';
import { AuthService } from '../auth/auth.service';
import { AuditService } from '../audit/audit.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly auditService: AuditService,
  ) {}

  @Post()
  @HasPermission('users')
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    const password = await bcrypt.hash(createUserDto.password, 12);

    const { role_id, ...data } = createUserDto;

    const user = await this.usersService.create({
      ...data,
      password,
      role: { id: role_id },
    });

    this.auditService.log(
      req.user.id, req.user.email,
      'CREATE', 'user', user.id,
      `Created user ${createUserDto.email}`,
      req.ip,
    );

    return user;
  }

  @Get()
  @HasPermission('users')
  async findAll(@Request() request) {
    return this.usersService.paginate('users', [['users.role', 'role']], {
      limit: request.query.limit,
      page: request.query.page,
      sort: request.query.sort,
      direction: request.query.direction,
      keyword: request.query.keyword,
      column: ['users.name'],
    });
  }

  @Patch(':id/password')
  @HasPermission('users')
  async changePassword(
    @Param('id') id: string,
    @Body('password') password: string,
    @Request() req,
  ) {
    const hashed = await bcrypt.hash(password, 12);
    await this.usersService.update(id, { password: hashed });
    await this.authService.revokeAllUserRefreshTokens(id);

    this.auditService.log(
      req.user.id, req.user.email,
      'CHANGE_PASSWORD', 'user', id,
      'Password changed, all sessions revoked',
      req.ip,
    );

    return { message: 'Password updated, all sessions revoked' };
  }
}
