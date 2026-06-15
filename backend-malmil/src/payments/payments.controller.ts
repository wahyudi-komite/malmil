import { Controller, Post, Get, Body, Param, Headers, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Pembayaran')
@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'Membuat transaksi pembayaran' })
  @Public()
  @Post('payments')
  async createTransaction(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createTransaction(dto);
  }

  @ApiOperation({ summary: 'Webhook Midtrans' })
  @Public()
  @Post('payments/webhook/midtrans')
  async midtransWebhook(@Req() req: any) {
    return this.paymentsService.handleMidtransWebhook(req.body);
  }

  @ApiOperation({ summary: 'Mendapatkan status pembayaran' })
  @ApiParam({ name: 'orderNumber', description: 'Nomor pesanan' })
  @ApiResponse({ status: 404, description: 'Pembayaran tidak ditemukan' })
  @Public()
  @Get('payments/:orderNumber')
  async getPaymentByOrder(@Param('orderNumber') orderNumber: string) {
    return this.paymentsService.getPaymentByOrder(orderNumber);
  }
}
