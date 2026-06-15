import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NewsletterSubscriber } from './entities/newsletter-subscriber.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
    @InjectRepository(NewsletterSubscriber)
    private readonly subscriberRepo: Repository<NewsletterSubscriber>,
  ) {}

  async findByUser(userId: string, limit = 20) {
    return this.notifRepo.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notifRepo.count({
      where: { user: { id: userId }, read_at: null },
    });
  }

  async markAsRead(id: string, userId: string): Promise<void> {
    await this.notifRepo.update(
      { id, user: { id: userId } },
      { read_at: new Date() },
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notifRepo.update(
      { user: { id: userId }, read_at: null },
      { read_at: new Date() },
    );
  }

  async create(data: Partial<Notification>): Promise<Notification> {
    return this.notifRepo.save(this.notifRepo.create(data));
  }

  // ─── Newsletter ────────────────────────────────────

  async subscribe(email: string): Promise<NewsletterSubscriber> {
    const existing = await this.subscriberRepo.findOne({ where: { email } });
    if (existing) {
      if (!existing.is_active) {
        existing.is_active = true;
        existing.unsubscribed_at = null;
        return this.subscriberRepo.save(existing);
      }
      throw new ConflictException('Email sudah terdaftar');
    }

    return this.subscriberRepo.save(
      this.subscriberRepo.create({ email }),
    );
  }

  async unsubscribe(email: string): Promise<void> {
    const subscriber = await this.subscriberRepo.findOne({ where: { email } });
    if (!subscriber) {
      throw new NotFoundException('Email tidak ditemukan');
    }
    subscriber.is_active = false;
    subscriber.unsubscribed_at = new Date();
    await this.subscriberRepo.save(subscriber);
  }
}
