import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { HasPermission } from '../permissions/has-permission.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Kupon')
@Controller()
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @ApiOperation({ summary: 'Mendapatkan daftar kupon (admin)' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('coupons')
  @Get('admin/coupons')
  async findAll(@Query() query: any) {
    return this.couponsService.findAll(query);
  }

  @ApiOperation({ summary: 'Mendapatkan detail kupon (admin)' })
  @ApiParam({ name: 'id', description: 'ID kupon' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @ApiResponse({ status: 404, description: 'Kupon tidak ditemukan' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('coupons')
  @Get('admin/coupons/:id')
  async findById(@Param('id') id: string) {
    return this.couponsService.findById(id);
  }

  @ApiOperation({ summary: 'Membuat kupon baru' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('coupons')
  @Post('admin/coupons')
  async create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @ApiOperation({ summary: 'Memperbarui kupon' })
  @ApiParam({ name: 'id', description: 'ID kupon' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @ApiResponse({ status: 404, description: 'Kupon tidak ditemukan' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('coupons')
  @Put('admin/coupons/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateCouponDto) {
    return this.couponsService.update(id, dto);
  }

  @ApiOperation({ summary: 'Menghapus kupon' })
  @ApiParam({ name: 'id', description: 'ID kupon' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 403, description: 'Tidak memiliki izin' })
  @ApiResponse({ status: 404, description: 'Kupon tidak ditemukan' })
  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('coupons')
  @Delete('admin/coupons/:id')
  async remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }

  @ApiOperation({ summary: 'Validasi kupon' })
  @Public()
  @Post('coupons/validate')
  async validate(
    @Body('code') code: string,
    @Body('subtotal') subtotal: number,
  ) {
    return this.couponsService.validateCoupon(code, subtotal);
  }
}
