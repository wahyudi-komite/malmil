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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { HasPermission } from './has-permission.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionsGuard } from './permissions.guard';
import { AuditService } from '../audit/audit.service';

@ApiTags('Peran & Izin')
@ApiBearerAuth()
@UseGuards(AuthGuard, PermissionsGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly auditService: AuditService,
  ) {}

  @ApiOperation({ summary: 'Membuat izin baru' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
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

  @ApiOperation({ summary: 'Mendapatkan semua izin' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @Get('all')
  @HasPermission('permissions')
  async all(@Request() request) {
    return this.permissionsService.findAll([], {
      sort: request.query.sort,
      direction: request.query.direction,
    });
  }

  @ApiOperation({ summary: 'Mendapatkan daftar izin' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
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

  @ApiOperation({ summary: 'Mendapatkan detail izin' })
  @ApiParam({ name: 'id', description: 'ID izin' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @ApiResponse({ status: 404, description: 'Izin tidak ditemukan' })
  @Get(':id')
  @HasPermission('permissions')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne({ id });
  }

  @ApiOperation({ summary: 'Memperbarui izin' })
  @ApiParam({ name: 'id', description: 'ID izin' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @ApiResponse({ status: 404, description: 'Izin tidak ditemukan' })
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

  @ApiOperation({ summary: 'Menghapus izin' })
  @ApiParam({ name: 'id', description: 'ID izin' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @ApiResponse({ status: 404, description: 'Izin tidak ditemukan' })
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

  @ApiOperation({ summary: 'Mendapatkan izin berdasarkan nama' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @Post('findName')
  @HasPermission('permissions')
  get(@Body('name') name: string) {
    return this.permissionsService.findOne({ name });
  }
}
