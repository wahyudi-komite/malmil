import {
  Controller, Get, Put, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { HasPermission } from '../permissions/has-permission.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()
  @Get('settings/public')
  async getPublicSettings() {
    return this.settingsService.getPublicSettings();
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('settings_view')
  @Get('admin/settings')
  async findAll(@Query('group') group?: string) {
    return this.settingsService.findAll(group);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('settings_view')
  @Get('admin/settings/:key')
  async findByKey(@Param('key') key: string) {
    const value = await this.settingsService.findByKey(key);
    return { key, value };
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('settings_view')
  @Put('admin/settings')
  async updateMultiple(@Body() body: Array<{ key: string; value: string; group?: string }>) {
    return this.settingsService.updateMultiple(body);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('settings_view')
  @Delete('admin/settings/:key')
  async remove(@Param('key') key: string) {
    await this.settingsService.remove(key);
    return { message: `Setting "${key}" telah dihapus` };
  }
}
