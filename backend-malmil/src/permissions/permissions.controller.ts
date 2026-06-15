import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { HasPermission } from './has-permission.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionsGuard } from './permissions.guard';
import { AuditService } from '../audit/audit.service';

@UseGuards(AuthGuard, PermissionsGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly auditService: AuditService,
  ) {}

  @Post()
  @HasPermission('permissions')
  async create(@Body() createPermissionDto: CreatePermissionDto, @Request() req) {
    const perm = await this.permissionsService.create(createPermissionDto);

    this.auditService.log(
      req.user.id, req.user.email,
      'CREATE', 'permission', perm.id,
      `Created permission ${createPermissionDto.name}`,
      req.ip,
    );

    return perm;
  }

  @Get('all')
  @HasPermission('permissions')
  async all(@Request() request) {
    return this.permissionsService.findAll([], {
      sort: request.query.sort,
      direction: request.query.direction,
    });
  }

  @Get()
  @HasPermission('permissions')
  async findAll(@Request() request) {
    return this.permissionsService.paginate('permissions', [], {
      limit: request.query.limit,
      page: request.query.page,
      sort: request.query.sort,
      direction: request.query.direction,
      keyword: request.query.keyword,
      column: ['name'],
    });
  }

  @Get(':id')
  @HasPermission('permissions')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Put(':id')
  @HasPermission('permissions')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @Request() req,
  ) {
    await this.permissionsService.update(id, updatePermissionDto);

    this.auditService.log(
      req.user.id, req.user.email,
      'UPDATE', 'permission', id,
      'Updated permission',
      req.ip,
    );
  }

  @Delete(':id')
  @HasPermission('permissions')
  async remove(@Param('id') id: string, @Request() req) {
    await this.permissionsService.remove(id);

    this.auditService.log(
      req.user.id, req.user.email,
      'DELETE', 'permission', id,
      'Deleted permission',
      req.ip,
    );
  }

  @Post('findName')
  @HasPermission('permissions')
  get(@Body('name') name: string) {
    return this.permissionsService.findOne({ name });
  }
}
