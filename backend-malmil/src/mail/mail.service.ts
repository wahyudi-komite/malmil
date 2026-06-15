import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private driver: string;

  constructor(private configService: ConfigService) {
    this.driver = this.configService.get<string>('MAIL_DRIVER', 'log');

    if (this.driver === 'smtp') {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('MAIL_HOST'),
        port: this.configService.get<number>('MAIL_PORT', 587),
        secure: this.configService.get<string>('MAIL_ENCRYPTION') === 'ssl',
        auth: {
          user: this.configService.get<string>('MAIL_USER'),
          pass: this.configService.get<string>('MAIL_PASS'),
        },
      });
    }
  }

  private getFrom() {
    return {
      address: this.configService.get<string>('MAIL_FROM_ADDRESS', 'noreply@malmil.id'),
      name: this.configService.get<string>('MAIL_FROM_NAME', 'Malmil'),
    };
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    if (this.driver === 'smtp' && this.transporter) {
      await this.transporter.sendMail({
        from: this.getFrom(),
        to,
        subject,
        html,
      });
    } else {
      this.logger.log(`[MAIL] To: ${to} | Subject: ${subject}`);
      this.logger.log(`[MAIL] Body: ${html.substring(0, 500)}...`);
    }
  }

  sendPasswordReset(to: string, token: string): Promise<void> {
    const appUrl = this.configService.get<string>('APP_URL', 'http://localhost:4200');
    const link = `${appUrl}/reset-password?token=${token}`;
    return this.sendMail(
      to,
      'Reset Password - Malmil',
      `
        <h2>Reset Password</h2>
        <p>Klik link berikut untuk mereset password Anda:</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:8px;margin:16px 0;">Reset Password</a>
        <p>Link ini berlaku selama 1 jam.</p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
      `,
    );
  }

  sendEmailVerification(to: string, token: string): Promise<void> {
    const appUrl = this.configService.get<string>('APP_URL', 'http://localhost:4200');
    const link = `${appUrl}/verify-email?token=${token}`;
    return this.sendMail(
      to,
      'Verifikasi Email - Malmil',
      `
        <h2>Verifikasi Email</h2>
        <p>Klik link berikut untuk memverifikasi email Anda:</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:8px;margin:16px 0;">Verifikasi Email</a>
        <p>Link ini berlaku selama 24 jam.</p>
      `,
    );
  }
}
