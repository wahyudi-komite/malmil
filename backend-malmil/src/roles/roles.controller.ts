import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Put,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { HasPermission } from 'src/permissions/has-permission.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { AuditService } from '../audit/audit.service';

@UseGuards(AuthGuard, PermissionsGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly auditService: AuditService,
  ) {}

  @Post()
  @HasPermission('roles')
  async create(@Body('name') name: string, @Body('permissions') ids: string[], @Request() req) {
    const role = await this.rolesService.create({
      name,
      permissions: ids.map((id) => ({ id })),
    });

    this.auditService.log(
      req.user.id, req.user.email,
      'CREATE', 'role', role.id,
      `Created role ${name}`,
      req.ip,
    );

    return role;
  }

  @Post('findName')
  @HasPermission('roles')
  get(@Body('name') name: string) {
    return this.rolesService.findOne({ name });
  }

  @Get()
  @HasPermission('roles')
  async findAll(@Request() request) {
    return this.rolesService.paginate(
      'roles',
      [['roles.permissions', 'permissions']],
      {
        limit: request.query.limit,
        page: request.query.page,
        sort: request.query.sort,
        direction: request.query.direction,
        keyword: request.query.keyword,
        column: ['roles.name'],
      },
    );
  }

  @Get('all')
  @HasPermission('roles')
  async all(@Request() request) {
    return this.rolesService.findAll([], {
      sort: request.query.sort,
      direction: request.query.direction,
      limit: request.query.limit,
    });
  }

  @Get(':id')
  @HasPermission('roles')
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id, ['permissions']);
  }

  @Put(':id')
  @HasPermission('roles')
  async update(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('permissions') ids: string[],
    @Request() req,
  ) {
    const role = await this.rolesService.updatePermissions(id, name, ids);

    this.auditService.log(
      req.user.id, req.user.email,
      'UPDATE', 'role', id,
      `Updated role to ${name}`,
      req.ip,
    );

    return role;
  }

  @Delete(':id')
  @HasPermission('roles')
  async remove(@Param('id') id: string, @Request() req) {
    await this.rolesService.remove(id);

    this.auditService.log(
      req.user.id, req.user.email,
      'DELETE', 'role', id,
      'Deleted role',
      req.ip,
    );
  }
}
