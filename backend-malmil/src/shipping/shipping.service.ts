import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingAddress } from './entities/shipping-address.entity';
import { Courier } from './entities/courier.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { RajaOngkirService } from './rajaongkir.service';

@Injectable()
export class ShippingService {
  private readonly rateCache = new Map<string, { data: any; expiry: number }>();
  private readonly CACHE_TTL_MS = 15 * 60 * 1000;

  constructor(
    @InjectRepository(ShippingAddress)
    private readonly addressRepo: Repository<ShippingAddress>,
    @InjectRepository(Courier)
    private readonly courierRepo: Repository<Courier>,
    private readonly rajaOngkir: RajaOngkirService,
  ) {}

  // ─── Addresses ──────────────────────────────────────

  async findAddressesByUser(userId: string): Promise<ShippingAddress[]> {
    return this.addressRepo.find({
      where: { user: { id: userId } },
      order: { is_default: 'DESC', created_at: 'DESC' },
    });
  }

  async findAddressById(id: string): Promise<ShippingAddress> {
    const address = await this.addressRepo.findOne({ where: { id } });
    if (!address) {
      throw new NotFoundException('Alamat tidak ditemukan');
    }
    return address;
  }

  async createAddress(
    userId: string,
    dto: CreateAddressDto,
  ): Promise<ShippingAddress> {
    if (dto.is_default) {
      await this.addressRepo.update(
        { user: { id: userId }, is_default: true },
        { is_default: false },
      );
    }

    const address = this.addressRepo.create({
      ...dto,
      user: { id: userId },
    });
    return this.addressRepo.save(address);
  }

  async updateAddress(
    id: string,
    userId: string,
    dto: UpdateAddressDto,
  ): Promise<ShippingAddress> {
    const address = await this.addressRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!address) {
      throw new NotFoundException('Alamat tidak ditemukan');
    }

    if (dto.is_default) {
      await this.addressRepo.update(
        { user: { id: userId }, is_default: true },
        { is_default: false },
      );
    }

    Object.assign(address, dto);
    return this.addressRepo.save(address);
  }

  async removeAddress(id: string, userId: string): Promise<void> {
    const result = await this.addressRepo.delete({ id, user: { id: userId } });
    if (!result.affected) {
      throw new NotFoundException('Alamat tidak ditemukan');
    }
  }

  // ─── Couriers ───────────────────────────────────────

  async findAllCouriers(): Promise<Courier[]> {
    return this.courierRepo.find({
      where: { is_active: true },
      order: { name: 'ASC' },
    });
  }

  // ─── Rate Calculation ───────────────────────────────

  async calculateRates(dto: { destination: string; weight: number; couriers?: string[] }) {
    const couriers = (dto.couriers?.length ? dto.couriers : ['jne', 'jnt', 'sicepat', 'anteraja', 'pos']).sort();
    const cacheKey = `${dto.destination}:${dto.weight}:${couriers.join(',')}`;

    const cached = this.rateCache.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }

    const origin = process.env.RAJAONGKIR_ORIGIN_CITY_ID;
    const apiKey = process.env.RAJAONGKIR_API_KEY;

    if (origin && apiKey) {
      try {
        const results = await Promise.all(
          couriers.map((code) =>
            this.rajaOngkir.getCost(origin, dto.destination, dto.weight, code).catch(() => null),
          ),
        );

        const rates = results
          .filter(Boolean)
          .flatMap((result: any) =>
            result.costs.map((cost: any) => ({
              courier_code: result.code,
              courier_name: result.name,
              service_type: cost.service,
              cost: cost.cost[0].value,
              etd: cost.cost[0].etd?.replace(/hari/i, '').trim() + ' hari' || '-',
            })),
          );

        const result = { rates };
        this.rateCache.set(cacheKey, { data: result, expiry: Date.now() + this.CACHE_TTL_MS });
        return result;
      } catch {
        // fallback to flat rate
      }
    }

    const rates = couriers.flatMap((code) => {
      const baseCost = this.getBaseCost(code);
      return [
        {
          courier_code: code,
          courier_name: this.getCourierName(code),
          service_type: 'Reguler',
          cost: baseCost + Math.ceil(dto.weight / 1000) * 2000,
          etd: '2-3 hari',
        },
        {
          courier_code: code,
          courier_name: this.getCourierName(code),
          service_type: 'Express',
          cost: baseCost + Math.ceil(dto.weight / 1000) * 5000,
          etd: '1-2 hari',
        },
      ];
    });

    const result = { rates };
    this.rateCache.set(cacheKey, { data: result, expiry: Date.now() + this.CACHE_TTL_MS });
    return result;
  }

  private getBaseCost(code: string): number {
    const costs: Record<string, number> = {
      jne: 10000,
      jnt: 9000,
      sicepat: 11000,
      anteraja: 8000,
      pos: 7000,
    };
    return costs[code] || 10000;
  }

  private getCourierName(code: string): string {
    const names: Record<string, string> = {
      jne: 'JNE',
      jnt: 'J&T Express',
      sicepat: 'SiCepat',
      anteraja: 'AnterAja',
      pos: 'Pos Indonesia',
    };
    return names[code] || code;
  }
}
