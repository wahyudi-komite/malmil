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
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('coupons_view')
  @Get('admin/coupons')
  async findAll(@Query() query: any) {
    return this.couponsService.findAll(query);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('coupons_view')
  @Get('admin/coupons/:id')
  async findById(@Param('id') id: string) {
    return this.couponsService.findById(id);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('coupons_create')
  @Post('admin/coupons')
  async create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('coupons_edit')
  @Put('admin/coupons/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateCouponDto) {
    return this.couponsService.update(id, dto);
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @HasPermission('coupons_delete')
  @Delete('admin/coupons/:id')
  async remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }

  @Public()
  @Post('coupons/validate')
  async validate(
    @Body('code') code: string,
    @Body('subtotal') subtotal: number,
  ) {
    return this.couponsService.validateCoupon(code, subtotal);
  }
}
