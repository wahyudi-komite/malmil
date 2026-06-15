import { Injectable } from '@nestjs/common';
import { provincesData, citiesData, Region } from './regions.data';

@Injectable()
export class RegionsService {
  findAllProvinces() {
    return provincesData;
  }

  findCitiesByProvince(provinceId: string) {
    return citiesData[provinceId] || [];
  }

  findDistrictsByCity(cityId: string) {
    return [];
  }
}
