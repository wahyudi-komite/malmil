import { Controller, Get, Param } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Wilayah')
@Controller('shipping')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @ApiOperation({ summary: 'Mendapatkan daftar provinsi' })
  @Public()
  @Get('provinces')
  findAllProvinces() {
    return this.regionsService.findAllProvinces();
  }

  @ApiOperation({ summary: 'Mendapatkan daftar kota berdasarkan provinsi' })
  @ApiParam({ name: 'provinceId', description: 'ID provinsi' })
  @Public()
  @Get('cities/:provinceId')
  findCitiesByProvince(@Param('provinceId') provinceId: string) {
    return this.regionsService.findCitiesByProvince(provinceId);
  }

  @ApiOperation({ summary: 'Mendapatkan daftar kecamatan berdasarkan kota' })
  @ApiParam({ name: 'cityId', description: 'ID kota' })
  @Public()
  @Get('districts/:cityId')
  findDistrictsByCity(@Param('cityId') cityId: string) {
    return this.regionsService.findDistrictsByCity(cityId);
  }
}
