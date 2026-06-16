import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards,
} from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CalculateRateDto } from './dto/calculate-rate.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Pengiriman')
@Controller()
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @ApiOperation({ summary: 'Mendapatkan daftar alamat' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @UseGuards(AuthGuard)
  @Get('addresses')
  async findAddresses(@CurrentUser() user: any) {
    return this.shippingService.findAddressesByUser(user.id);
  }

  @ApiOperation({ summary: 'Mendapatkan detail alamat' })
  @ApiParam({ name: 'id', description: 'ID alamat' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 404, description: 'Alamat tidak ditemukan' })
  @UseGuards(AuthGuard)
  @Get('addresses/:id')
  async findAddressById(@Param('id') id: string) {
    return this.shippingService.findAddressById(id);
  }

  @ApiOperation({ summary: 'Menambahkan alamat baru' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @UseGuards(AuthGuard)
  @Post('addresses')
  async createAddress(
    @Body() dto: CreateAddressDto,
    @CurrentUser() user: any,
  ) {
    return this.shippingService.createAddress(user.id, dto);
  }

  @ApiOperation({ summary: 'Memperbarui alamat' })
  @ApiParam({ name: 'id', description: 'ID alamat' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 404, description: 'Alamat tidak ditemukan' })
  @UseGuards(AuthGuard)
  @Put('addresses/:id')
  async updateAddress(
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
    @CurrentUser() user: any,
  ) {
    return this.shippingService.updateAddress(id, user.id, dto);
  }

  @ApiOperation({ summary: 'Menghapus alamat' })
  @ApiParam({ name: 'id', description: 'ID alamat' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  @ApiResponse({ status: 404, description: 'Alamat tidak ditemukan' })
  @UseGuards(AuthGuard)
  @Delete('addresses/:id')
  async removeAddress(@Param('id') id: string, @CurrentUser() user: any) {
    return this.shippingService.removeAddress(id, user.id);
  }

  @ApiOperation({ summary: 'Mendapatkan daftar kurir' })
  @Public()
  @Get('couriers')
  async findAllCouriers() {
    return this.shippingService.findAllCouriers();
  }

  @ApiOperation({ summary: 'Menghitung ongkos kirim' })
  @Public()
  @Post('shipping/rates')
  async calculateRates(@Body() dto: CalculateRateDto) {
    return this.shippingService.calculateRates(dto);
  }
}
