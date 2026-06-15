import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { HasPermission } from '../permissions/has-permission.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Public()
  @Get('banners')
  async findActive(@Query('position') position?: string) {
    return this.bannersService.findActive(position);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('banners_view')
  @Get('admin/banners')
  async findAllAdmin(@Query() query: any) {
    return this.bannersService.findAllAdmin(query);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('banners_view')
  @Get('admin/banners/:id')
  async findById(@Param('id') id: string) {
    return this.bannersService.findById(id);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('banners_create')
  @Post('admin/banners')
  async create(@Body() data: any) {
    return this.bannersService.create(data);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('banners_edit')
  @Put('admin/banners/:id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.bannersService.update(id, data);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('banners_delete')
  @Delete('admin/banners/:id')
  async remove(@Param('id') id: string) {
    return this.bannersService.remove(id);
  }
}
