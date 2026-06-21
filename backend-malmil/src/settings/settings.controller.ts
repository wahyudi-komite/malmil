import {
  Controller, Get, Put, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { HasPermission } from '../permissions/has-permission.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Pengaturan')
@Controller()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: 'Mendapatkan pengaturan publik' })
  @Public()
  @Get('settings/public')
  async getPublicSettings() {
    return this.settingsService.getPublicSettings();
  }

  @ApiOperation({ summary: 'Mendapatkan daftar pengaturan (admin)' })
  @ApiQuery({ name: 'group', required: false, description: 'Grup pengaturan' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('settings')
  @Get('admin/settings')
  async findAll(@Query('group') group?: string) {
    return this.settingsService.findAll(group);
  }

  @ApiOperation({ summary: 'Mendapatkan pengaturan berdasarkan key' })
  @ApiParam({ name: 'key', description: 'Key pengaturan' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @ApiResponse({ status: 404, description: 'Pengaturan tidak ditemukan' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('settings')
  @Get('admin/settings/:key')
  async findByKey(@Param('key') key: string) {
    const value = await this.settingsService.findByKey(key);
    return { key, value };
  }

  @ApiOperation({ summary: 'Memperbarui pengaturan' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('settings')
  @Put('admin/settings')
  async updateMultiple(@Body() body: Array<{ key: string; value: string; group?: string }>) {
    return this.settingsService.updateMultiple(body);
  }

  @ApiOperation({ summary: 'Menghapus pengaturan' })
  @ApiParam({ name: 'key', description: 'Key pengaturan' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @ApiResponse({ status: 404, description: 'Pengaturan tidak ditemukan' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('settings')
  @Delete('admin/settings/:key')
  async remove(@Param('key') key: string) {
    await this.settingsService.remove(key);
    return { message: `Setting "${key}" telah dihapus` };
  }
}
