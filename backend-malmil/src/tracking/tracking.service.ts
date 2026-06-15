import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface TrackingEvent {
  eventName: string;
  eventId?: string;
  eventTime?: number;
  userData?: {
    email?: string;
    phone?: string;
    name?: string;
  };
  customData?: Record<string, any>;
}

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);
  private readonly metaPixelId: string;
  private readonly metaAccessToken: string;
  private readonly gaMeasurementId: string;
  private readonly gaApiSecret: string;

  constructor(private config: ConfigService) {
    this.metaPixelId = this.config.get('META_PIXEL_ID') || '';
    this.metaAccessToken = this.config.get('META_ACCESS_TOKEN') || '';
    this.gaMeasurementId = this.config.get('GA_MEASUREMENT_ID') || '';
    this.gaApiSecret = this.config.get('GA_API_SECRET') || '';
  }

  async trackEvent(event: TrackingEvent): Promise<void> {
    const promises: Promise<any>[] = [];

    if (this.metaPixelId && this.metaAccessToken) {
      promises.push(this.sendToMeta(event));
    }

    if (this.gaMeasurementId && this.gaApiSecret) {
      promises.push(this.sendToGA4(event));
    }

    if (promises.length === 0) {
      this.logger.warn('No tracking providers configured');
      return;
    }

    await Promise.allSettled(promises);
  }

  private async sendToMeta(event: TrackingEvent) {
    try {
      const { createHash } = require('crypto');
      const sha256 = (data: string) => createHash('sha256').update(data).digest('hex');

      const payload = {
        data: [
          {
            event_name: event.eventName,
            event_time: event.eventTime || Math.floor(Date.now() / 1000),
            event_id: event.eventId,
            action_source: 'website',
            user_data: {
              em: event.userData?.email ? [sha256(event.userData.email)] : [],
              ph: event.userData?.phone ? [sha256(event.userData.phone)] : [],
              fn: event.userData?.name ? [sha256(event.userData.name.toLowerCase())] : [],
            },
            custom_data: event.customData || {},
          },
        ],
        access_token: this.metaAccessToken,
      };

      const url = `https://graph.facebook.com/v18.0/${this.metaPixelId}/events`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        this.logger.error(`Meta CAPI error: ${response.status} ${await response.text()}`);
      }
    } catch (error) {
      this.logger.error('Failed to send event to Meta', error);
    }
  }

  private async sendToGA4(event: TrackingEvent) {
    try {
      const payload = {
        client_id: event.eventId || 'anonymous',
        events: [
          {
            name: event.eventName,
            params: {
              ...event.customData,
              engagement_time_msec: 1,
            },
          },
        ],
      };

      const url = `https://www.google-analytics.com/mp/collect?measurement_id=${this.gaMeasurementId}&api_secret=${this.gaApiSecret}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        this.logger.error(`GA4 error: ${response.status} ${await response.text()}`);
      }
    } catch (error) {
      this.logger.error('Failed to send event to GA4', error);
    }
  }
}
