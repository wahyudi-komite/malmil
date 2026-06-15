import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepo: Repository<Setting>,
  ) {}

  async findAll(group?: string) {
    const where: any = {};
    if (group) where.group = group;

    return this.settingRepo.find({ where, order: { group: 'ASC', key: 'ASC' } });
  }

  async findByKey(key: string): Promise<string | null> {
    const setting = await this.settingRepo.findOne({ where: { key } });
    return setting?.value || null;
  }

  async set(key: string, value: string, group = 'general') {
    let setting = await this.settingRepo.findOne({ where: { key } });

    if (setting) {
      setting.value = value;
    } else {
      setting = this.settingRepo.create({ key, value, group });
    }

    return this.settingRepo.save(setting);
  }

  async updateMultiple(settings: Array<{ key: string; value: string; group?: string }>) {
    const results = [];
    for (const s of settings) {
      results.push(await this.set(s.key, s.value, s.group || 'general'));
    }
    return results;
  }

  async remove(key: string): Promise<void> {
    const result = await this.settingRepo.delete({ key });
    if (!result.affected) {
      throw new NotFoundException(`Setting "${key}" tidak ditemukan`);
    }
  }

  async getPublicSettings() {
    const settings = await this.settingRepo.find({
      where: [
        { group: 'general' },
        { group: 'social' },
        { group: 'shipping' },
      ],
    });

    const result: Record<string, string> = {};
    for (const s of settings) {
      result[s.key] = s.value;
    }
    return result;
  }
}
