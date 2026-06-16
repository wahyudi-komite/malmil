import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { RajaOngkirService } from './rajaongkir.service';
import { RegionsController } from './regions/regions.controller';
import { RegionsService } from './regions/regions.service';
import { ShippingAddress } from './entities/shipping-address.entity';
import { Courier } from './entities/courier.entity';
import { ShippingRate } from './entities/shipping-rate.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShippingAddress, Courier, ShippingRate]),
    CommonModule,
  ],
  controllers: [ShippingController, RegionsController],
  providers: [ShippingService, RajaOngkirService, RegionsService],
  exports: [ShippingService],
})
export class ShippingModule {}
