import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Brackets } from 'typeorm';
import { Banner } from './entities/banner.entity';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepo: Repository<Banner>,
  ) {}

  async findActive(position?: string) {
    const where: any = {
      is_active: true,
    };

    if (position) {
      where.position = position;
    }

    const now = new Date();
    const banners = await this.bannerRepo.find({
      where: [
        { ...where, starts_at: null, expires_at: null },
        { ...where, starts_at: LessThan(now), expires_at: null },
        { ...where, starts_at: null, expires_at: MoreThan(now) },
        { ...where, starts_at: LessThan(now), expires_at: MoreThan(now) },
      ],
      order: { sort_order: 'ASC' },
    });

    return banners;
  }

  async findAllAdmin(query: any) {
    const take = query.limit || 20;
    const page = query.page || 1;

    const qb = this.bannerRepo.createQueryBuilder('banner');

    if (query.keyword) {
      qb.where('banner.title LIKE :keyword', { keyword: `%${query.keyword}%` });
    }

    qb.orderBy('banner.sort_order', 'ASC')
      .take(take)
      .skip((page - 1) * take);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: { total, page, last_page: Math.ceil(total / take), pageSize: take },
    };
  }

  async findById(id: string): Promise<Banner> {
    const banner = await this.bannerRepo.findOne({ where: { id } });
    if (!banner) {
      throw new NotFoundException('Banner tidak ditemukan');
    }
    return banner;
  }

  async create(data: Partial<Banner>): Promise<Banner> {
    const banner = this.bannerRepo.create({
      ...data,
      starts_at: data.starts_at ? new Date(data.starts_at) : undefined,
      expires_at: data.expires_at ? new Date(data.expires_at) : undefined,
    });
    return this.bannerRepo.save(banner);
  }

  async update(id: string, data: Partial<Banner>): Promise<Banner> {
    const banner = await this.findById(id);
    Object.assign(banner, {
      ...data,
      starts_at: data.starts_at ? new Date(data.starts_at) : banner.starts_at,
      expires_at: data.expires_at ? new Date(data.expires_at) : banner.expires_at,
    });
    return this.bannerRepo.save(banner);
  }

  async remove(id: string): Promise<void> {
    const result = await this.bannerRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Banner tidak ditemukan');
    }
  }
}
