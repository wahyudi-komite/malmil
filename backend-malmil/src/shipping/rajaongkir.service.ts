import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RajaOngkirService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.RAJAONGKIR_API_KEY || '';
    this.baseUrl = (process.env.RAJAONGKIR_BASE_URL || 'https://api.rajaongkir.com/starter').replace(/\/+$/, '');
  }

  async getProvinces() {
    const { data } = await axios.get(`${this.baseUrl}/province`, {
      headers: { key: this.apiKey },
    });
    return data.rajaongkir.results;
  }

  async getCities(provinceId?: string) {
    const params: any = {};
    if (provinceId) params.province = provinceId;
    const { data } = await axios.get(`${this.baseUrl}/city`, {
      headers: { key: this.apiKey },
      params,
    });
    return data.rajaongkir.results;
  }

  async getCost(origin: string, destination: string, weight: number, courier: string) {
    const { data } = await axios.post(
      `${this.baseUrl}/cost`,
      new URLSearchParams({
        origin,
        destination,
        weight: String(Math.ceil(weight)),
        courier,
      }),
      {
        headers: {
          key: this.apiKey,
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return data.rajaongkir.results;
  }
}
