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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { HasPermission } from '../permissions/has-permission.decorator';
import { AuthService } from '../auth/auth.service';
import { AuditService } from '../audit/audit.service';

@ApiTags('Pengguna')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly auditService: AuditService,
  ) {}

  @ApiOperation({ summary: 'Membuat pengguna baru' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
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

  @ApiOperation({ summary: 'Mendapatkan daftar pengguna' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
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

  @ApiOperation({ summary: 'Mengubah kata sandi pengguna' })
  @ApiParam({ name: 'id', description: 'ID pengguna' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @ApiResponse({ status: 404, description: 'Pengguna tidak ditemukan' })
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
