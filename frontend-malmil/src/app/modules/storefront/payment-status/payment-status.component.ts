import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { PaymentService } from '../../../services/payment.service';
import { OrderService } from '../../../services/order.service';
import { CurrencyIdrPipe } from '../../../shared/pipes/currency-idr.pipe';

@Component({
    selector: 'app-payment-status',
    templateUrl: './payment-status.component.html',
    standalone: true,
    imports: [RouterLink, NgIf, CurrencyIdrPipe],
})
export class PaymentStatusComponent implements OnInit {
    order: any = null;
    payment: any = null;
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private orderService: OrderService,
        private paymentService: PaymentService,
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.orderService.getByOrderNumber(params['orderNumber']).subscribe({
                next: (order) => {
                    this.order = order;
                    this.loading = false;
                    if (order.payment) this.payment = order.payment;
                },
                error: () => (this.loading = false),
            });
        });
    }

    get statusLabel(): string {
        const labels: Record<string, string> = {
            pending: 'Menunggu Pembayaran',
            waiting_payment: 'Menunggu Pembayaran',
            paid: 'Pembayaran Berhasil',
            processing: 'Diproses',
            shipped: 'Dikirim',
            delivered: 'Selesai',
            cancelled: 'Dibatalkan',
        };
        return labels[this.order?.status] || this.order?.status || '';
    }

    get isPaid(): boolean {
        return ['paid', 'processing', 'shipped', 'delivered'].includes(this.order?.status);
    }

    get isPending(): boolean {
        return ['pending', 'waiting_payment'].includes(this.order?.status);
    }
}
