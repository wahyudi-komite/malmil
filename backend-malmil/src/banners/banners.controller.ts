import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { HasPermission } from '../permissions/has-permission.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Banner')
@Controller()
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @ApiOperation({ summary: 'Mendapatkan banner aktif' })
  @ApiQuery({ name: 'position', required: false, description: 'Posisi banner' })
  @Public()
  @Get('banners')
  async findActive(@Query('position') position?: string) {
    return this.bannersService.findActive(position);
  }

  @ApiOperation({ summary: 'Mendapatkan daftar banner (admin)' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('banners_view')
  @Get('admin/banners')
  async findAllAdmin(@Query() query: any) {
    return this.bannersService.findAllAdmin(query);
  }

  @ApiOperation({ summary: 'Mendapatkan detail banner' })
  @ApiParam({ name: 'id', description: 'ID banner' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @ApiResponse({ status: 404, description: 'Banner tidak ditemukan' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('banners_view')
  @Get('admin/banners/:id')
  async findById(@Param('id') id: string) {
    return this.bannersService.findById(id);
  }

  @ApiOperation({ summary: 'Membuat banner baru' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('banners_create')
  @Post('admin/banners')
  async create(@Body() data: any) {
    return this.bannersService.create(data);
  }

  @ApiOperation({ summary: 'Memperbarui banner' })
  @ApiParam({ name: 'id', description: 'ID banner' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @ApiResponse({ status: 404, description: 'Banner tidak ditemukan' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('banners_edit')
  @Put('admin/banners/:id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.bannersService.update(id, data);
  }

  @ApiOperation({ summary: 'Menghapus banner' })
  @ApiParam({ name: 'id', description: 'ID banner' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @ApiResponse({ status: 404, description: 'Banner tidak ditemukan' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('banners_delete')
  @Delete('admin/banners/:id')
  async remove(@Param('id') id: string) {
    return this.bannersService.remove(id);
  }
}
