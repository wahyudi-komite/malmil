import { Injectable } from '@nestjs/common';
import { provincesData, citiesData } from './regions.data';
import { districtsData } from './districts.data';

@Injectable()
export class RegionsService {
  findAllProvinces() {
    return provincesData;
  }

  findCitiesByProvince(provinceId: string) {
    return citiesData[provinceId] || [];
  }

  findDistrictsByCity(cityId: string) {
    return districtsData[cityId] || [];
  }
}
