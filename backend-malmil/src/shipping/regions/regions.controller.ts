import { Controller, Get, Param } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { Public } from '../../common/decorators/public.decorator';

@Controller('shipping')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Public()
  @Get('provinces')
  findAllProvinces() {
    return this.regionsService.findAllProvinces();
  }

  @Public()
  @Get('cities/:provinceId')
  findCitiesByProvince(@Param('provinceId') provinceId: string) {
    return this.regionsService.findCitiesByProvince(provinceId);
  }

  @Public()
  @Get('districts/:cityId')
  findDistrictsByCity(@Param('cityId') cityId: string) {
    return this.regionsService.findDistrictsByCity(cityId);
  }
}
