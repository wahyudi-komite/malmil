import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { MidtransGateway } from './gateways/midtrans.gateway';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly midtransGateway: MidtransGateway,
    private readonly config: ConfigService,
  ) {}

  async createTransaction(dto: CreatePaymentDto) {
    const order = await this.orderRepo.findOne({
      where: { order_number: dto.order_id },
      relations: ['items', 'payment'],
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    if (order.payment) {
      return { snap_url: order.payment.snap_url, payment: order.payment };
    }

    const result = await this.midtransGateway.createTransaction({
      orderId: order.order_number,
      amount: order.total,
      customerDetails: dto.customer_details,
      items: order.items.map((item) => ({
        name: `${item.product_name} - ${item.variant_name}`,
        price: item.price,
        quantity: item.quantity,
      })),
    });

    const payment = this.paymentRepo.create({
      order: { id: order.id },
      gateway: 'midtrans',
      amount: order.total,
      status: PaymentStatus.PENDING,
      snap_url: result.snapUrl,
    });

    const saved = await this.paymentRepo.save(payment);

    return { snap_url: result.snapUrl, token: result.token, payment: saved };
  }

  async handleMidtransWebhook(payload: any) {
    const result = await this.midtransGateway.handleWebhook(payload);

    const payment = await this.paymentRepo.findOne({
      where: { order: { order_number: result.orderId } },
      relations: ['order'],
    });

    if (!payment) {
      this.logger.warn(`Payment not found for order: ${result.orderId}`);
      return { received: true };
    }

    payment.gateway_ref = result.gatewayRef;
    payment.method = result.paymentMethod;
    payment.raw_response = result.rawResponse;

    if (result.transactionStatus === 'paid') {
      payment.status = PaymentStatus.PAID;
      payment.paid_at = new Date();
      if (payment.order) {
        payment.order.status = OrderStatus.PAID;
        await this.orderRepo.save(payment.order);
      }
    } else if (result.transactionStatus === 'failed') {
      payment.status = PaymentStatus.FAILED;
    } else if (result.transactionStatus === 'expired') {
      payment.status = PaymentStatus.EXPIRED;
    } else if (result.transactionStatus === 'refunded') {
      payment.status = PaymentStatus.REFUNDED;
    }

    await this.paymentRepo.save(payment);

    return { received: true };
  }

  async getPaymentByOrder(orderNumber: string) {
    return this.paymentRepo.findOne({
      where: { order: { order_number: orderNumber } },
    });
  }
}
