import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CalculateRateDto } from './dto/calculate-rate.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @UseGuards(AuthGuard)
  @Get('addresses')
  async findAddresses(@CurrentUser() user: any) {
    return this.shippingService.findAddressesByUser(user.id);
  }

  @UseGuards(AuthGuard)
  @Get('addresses/:id')
  async findAddressById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.shippingService.findAddressById(id);
  }

  @UseGuards(AuthGuard)
  @Post('addresses')
  async createAddress(
    @Body() dto: CreateAddressDto,
    @CurrentUser() user: any,
  ) {
    return this.shippingService.createAddress(user.id, dto);
  }

  @UseGuards(AuthGuard)
  @Put('addresses/:id')
  async updateAddress(
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
    @CurrentUser() user: any,
  ) {
    return this.shippingService.updateAddress(id, user.id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete('addresses/:id')
  async removeAddress(@Param('id') id: string, @CurrentUser() user: any) {
    return this.shippingService.removeAddress(id, user.id);
  }

  @Public()
  @Get('couriers')
  async findAllCouriers() {
    return this.shippingService.findAllCouriers();
  }

  @Public()
  @Post('shipping/rates')
  async calculateRates(@Body() dto: CalculateRateDto) {
    return this.shippingService.calculateRates(dto);
  }
}
