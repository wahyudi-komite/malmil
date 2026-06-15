import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentGatewayInterface } from './payment-gateway.interface';

@Injectable()
export class MidtransGateway implements PaymentGatewayInterface {
  private readonly logger = new Logger(MidtransGateway.name);
  private snap: any;
  private core: any;

  constructor(private config: ConfigService) {
    const Midtrans = require('midtrans-client');

    const isProduction = this.config.get('MIDTRANS_IS_PRODUCTION') === 'true';
    const serverKey = this.config.get<string>('MIDTRANS_SERVER_KEY');

    this.snap = new Midtrans.Snap({
      isProduction,
      serverKey,
      clientKey: this.config.get<string>('MIDTRANS_CLIENT_KEY'),
    });

    this.core = new Midtrans.CoreApi({
      isProduction,
      serverKey,
      clientKey: this.config.get<string>('MIDTRANS_CLIENT_KEY'),
    });
  }

  async createTransaction(params: {
    orderId: string;
    amount: number;
    customerDetails?: { name?: string; email?: string; phone?: string };
    items?: Array<{ name: string; price: number; quantity: number }>;
  }) {
    try {
      const payload = {
        transaction_details: {
          order_id: params.orderId,
          gross_amount: params.amount,
        },
        customer_details: params.customerDetails || {},
        item_details: params.items || [],
      };

      const response = await this.snap.createTransaction(payload);

      return {
        transactionId: response.token || '',
        snapUrl: response.redirect_url || '',
        token: response.token || '',
      };
    } catch (error) {
      this.logger.error('Midtrans createTransaction failed', error);
      throw error;
    }
  }

  async handleWebhook(payload: any, _signatureKey: string) {
    this.logger.log('Midtrans webhook received', payload);

    const orderId = payload.order_id;
    const transactionStatus = payload.transaction_status;
    const gatewayRef = payload.transaction_id || '';
    const paymentMethod = payload.payment_type || '';

    let status: string;
    switch (transactionStatus) {
      case 'capture':
      case 'settlement':
        status = 'paid';
        break;
      case 'pending':
        status = 'pending';
        break;
      case 'deny':
      case 'cancel':
      case 'expire':
        status = 'failed';
        break;
      case 'refund':
      case 'partial_refund':
        status = 'refunded';
        break;
      default:
        status = 'pending';
    }

    return {
      orderId,
      transactionStatus: status,
      gatewayRef,
      paymentMethod,
      rawResponse: payload,
    };
  }

  async checkStatus(transactionId: string) {
    try {
      const response = await this.core.transaction.status(transactionId);
      return {
        orderId: response.order_id,
        transactionStatus: response.transaction_status,
        amount: Number(response.gross_amount),
      };
    } catch (error) {
      this.logger.error('Midtrans checkStatus failed', error);
      throw error;
    }
  }
}
