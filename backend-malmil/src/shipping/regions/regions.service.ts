import { Injectable } from '@nestjs/common';

export interface Region {
  id: string;
  name: string;
}

@Injectable()
export class RegionsService {
  private readonly provinces: Region[] = [
    { id: '11', name: 'Aceh' },
    { id: '12', name: 'Sumatera Utara' },
    { id: '13', name: 'Sumatera Barat' },
    { id: '14', name: 'Riau' },
    { id: '15', name: 'Jambi' },
    { id: '16', name: 'Sumatera Selatan' },
    { id: '17', name: 'Bengkulu' },
    { id: '18', name: 'Lampung' },
    { id: '19', name: 'Kepulauan Bangka Belitung' },
    { id: '21', name: 'Kepulauan Riau' },
    { id: '31', name: 'DKI Jakarta' },
    { id: '32', name: 'Jawa Barat' },
    { id: '33', name: 'Jawa Tengah' },
    { id: '34', name: 'DI Yogyakarta' },
    { id: '35', name: 'Jawa Timur' },
    { id: '36', name: 'Banten' },
    { id: '51', name: 'Bali' },
    { id: '52', name: 'Nusa Tenggara Barat' },
    { id: '53', name: 'Nusa Tenggara Timur' },
    { id: '61', name: 'Kalimantan Barat' },
    { id: '62', name: 'Kalimantan Tengah' },
    { id: '63', name: 'Kalimantan Selatan' },
    { id: '64', name: 'Kalimantan Timur' },
    { id: '65', name: 'Kalimantan Utara' },
    { id: '71', name: 'Sulawesi Utara' },
    { id: '72', name: 'Sulawesi Tengah' },
    { id: '73', name: 'Sulawesi Selatan' },
    { id: '74', name: 'Sulawesi Tenggara' },
    { id: '75', name: 'Gorontalo' },
    { id: '76', name: 'Sulawesi Barat' },
    { id: '81', name: 'Maluku' },
    { id: '82', name: 'Maluku Utara' },
    { id: '91', name: 'Papua' },
    { id: '92', name: 'Papua Tengah' },
    { id: '93', name: 'Papua Pegunungan' },
    { id: '94', name: 'Papua Selatan' },
    { id: '95', name: 'Papua Barat Daya' },
  ];

  private readonly cities: Record<string, Region[]> = {
    '31': [
      { id: '3171', name: 'Kota Jakarta Pusat' },
      { id: '3172', name: 'Kota Jakarta Utara' },
      { id: '3173', name: 'Kota Jakarta Barat' },
      { id: '3174', name: 'Kota Jakarta Selatan' },
      { id: '3175', name: 'Kota Jakarta Timur' },
      { id: '3101', name: 'Kabupaten Kepulauan Seribu' },
    ],
    '32': [
      { id: '3271', name: 'Kota Bogor' },
      { id: '3273', name: 'Kota Bandung' },
      { id: '3274', name: 'Kota Cirebon' },
      { id: '3275', name: 'Kota Bekasi' },
      { id: '3276', name: 'Kota Depok' },
      { id: '3279', name: 'Kota Banjar' },
      { id: '3201', name: 'Kabupaten Bogor' },
      { id: '3204', name: 'Kabupaten Bandung' },
      { id: '3205', name: 'Kabupaten Garut' },
      { id: '3207', name: 'Kabupaten Ciamis' },
      { id: '3208', name: 'Kabupaten Kuningan' },
      { id: '3209', name: 'Kabupaten Cirebon' },
      { id: '3210', name: 'Kabupaten Majalengka' },
      { id: '3211', name: 'Kabupaten Sumedang' },
      { id: '3212', name: 'Kabupaten Indramayu' },
      { id: '3213', name: 'Kabupaten Subang' },
      { id: '3214', name: 'Kabupaten Purwakarta' },
      { id: '3215', name: 'Kabupaten Karawang' },
      { id: '3216', name: 'Kabupaten Bekasi' },
      { id: '3217', name: 'Kabupaten Bandung Barat' },
      { id: '3218', name: 'Kabupaten Pangandaran' },
      { id: '3277', name: 'Kota Cimahi' },
      { id: '3278', name: 'Kota Tasikmalaya' },
    ],
  };

  private readonly districts: Record<string, Region[]> = {
    '3171': [
      { id: '3171010', name: 'Cempaka Putih' },
      { id: '3171020', name: 'Gambir' },
      { id: '3171030', name: 'Johar Baru' },
      { id: '3171040', name: 'Kemayoran' },
      { id: '3171050', name: 'Menteng' },
      { id: '3171060', name: 'Senen' },
      { id: '3171070', name: 'Tanah Abang' },
    ],
  };

  findAllProvinces() {
    return this.provinces;
  }

  findCitiesByProvince(provinceId: string) {
    return this.cities[provinceId] || [];
  }

  findDistrictsByCity(cityId: string) {
    return this.districts[cityId] || [];
  }
}
