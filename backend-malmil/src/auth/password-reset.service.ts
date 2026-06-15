import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordReset } from './entities/password-reset.entity';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(PasswordReset)
    private readonly repo: Repository<PasswordReset>,
    private readonly mailService: MailService,
  ) {}

  async sendResetLink(email: string): Promise<void> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.repo.save({ email, token, expires_at: expiresAt });
    await this.mailService.sendPasswordReset(email, token);
  }

  async validateToken(token: string): Promise<PasswordReset | null> {
    const record = await this.repo.findOne({
      where: { token, used_at: null },
    });
    if (!record) return null;
    if (new Date() > record.expires_at) return null;
    return record;
  }

  async markUsed(id: string): Promise<void> {
    await this.repo.update(id, { used_at: new Date() });
  }
}
