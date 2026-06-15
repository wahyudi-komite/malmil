import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Brackets } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
  ) {}

  async findAll(query: any) {
    const take = query.limit || 20;
    const page = query.page || 1;

    const qb = this.couponRepo.createQueryBuilder('coupon');

    if (query.keyword) {
      qb.where('coupon.code LIKE :keyword', { keyword: `%${query.keyword}%` });
    }

    qb.orderBy('coupon.created_at', 'DESC')
      .take(take)
      .skip((page - 1) * take);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: { total, page, last_page: Math.ceil(total / take), pageSize: take },
    };
  }

  async findById(id: string): Promise<Coupon> {
    const coupon = await this.couponRepo.findOne({ where: { id } });
    if (!coupon) {
      throw new NotFoundException('Kupon tidak ditemukan');
    }
    return coupon;
  }

  async findByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponRepo.findOne({ where: { code } });
    if (!coupon) {
      throw new NotFoundException('Kupon tidak ditemukan');
    }
    return coupon;
  }

  async create(dto: CreateCouponDto): Promise<Coupon> {
    const existing = await this.couponRepo.findOne({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException(`Kode kupon "${dto.code}" sudah ada`);
    }

    const coupon = this.couponRepo.create({
      ...dto,
      starts_at: dto.starts_at ? new Date(dto.starts_at) : undefined,
      expires_at: dto.expires_at ? new Date(dto.expires_at) : undefined,
    });

    return this.couponRepo.save(coupon);
  }

  async update(id: string, dto: UpdateCouponDto): Promise<Coupon> {
    const coupon = await this.findById(id);

    if (dto.code && dto.code !== coupon.code) {
      const existing = await this.couponRepo.findOne({
        where: { code: dto.code },
      });
      if (existing) {
        throw new ConflictException(`Kode kupon "${dto.code}" sudah ada`);
      }
    }

    Object.assign(coupon, {
      ...dto,
      starts_at: dto.starts_at ? new Date(dto.starts_at) : coupon.starts_at,
      expires_at: dto.expires_at ? new Date(dto.expires_at) : coupon.expires_at,
    });

    return this.couponRepo.save(coupon);
  }

  async remove(id: string): Promise<void> {
    const result = await this.couponRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Kupon tidak ditemukan');
    }
  }

  async validateCoupon(code: string, subtotal: number): Promise<{ coupon: Coupon; discountAmount: number }> {
    const coupon = await this.couponRepo.findOne({
      where: { code, is_active: true },
    });

    if (!coupon) {
      throw new BadRequestException('Kode kupon tidak valid');
    }

    if (coupon.expires_at && new Date() > coupon.expires_at) {
      throw new BadRequestException('Kupon sudah kadaluarsa');
    }

    if (coupon.starts_at && new Date() < coupon.starts_at) {
      throw new BadRequestException('Kupon belum berlaku');
    }

    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      throw new BadRequestException('Kupon sudah mencapai batas pemakaian');
    }

    if (subtotal < Number(coupon.min_order)) {
      throw new BadRequestException(
        `Minimum belanja Rp${Number(coupon.min_order).toLocaleString('id-ID')} untuk kupon ini`,
      );
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * Number(coupon.value)) / 100);
      if (coupon.max_discount && discountAmount > Number(coupon.max_discount)) {
        discountAmount = Number(coupon.max_discount);
      }
    } else {
      discountAmount = Number(coupon.value);
    }

    return { coupon, discountAmount };
  }

  async incrementUsage(id: string): Promise<void> {
    await this.couponRepo.increment({ id }, 'used_count', 1);
  }
}
