import { Controller, Post, Get, Body, Param, Headers, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Public()
  @Post('payments')
  async createTransaction(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createTransaction(dto);
  }

  @Public()
  @Post('payments/webhook/midtrans')
  async midtransWebhook(@Req() req: any) {
    return this.paymentsService.handleMidtransWebhook(req.body);
  }

  @Public()
  @Get('payments/:orderNumber')
  async getPaymentByOrder(@Param('orderNumber') orderNumber: string) {
    return this.paymentsService.getPaymentByOrder(orderNumber);
  }
}
