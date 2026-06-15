import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { CurrencyIdrPipe } from '../../../shared/pipes/currency-idr.pipe';

@Component({
    selector: 'app-order-tracking',
    templateUrl: './order-tracking.component.html',
    standalone: true,
    imports: [RouterLink, NgForOf, NgIf, CurrencyIdrPipe],
})
export class OrderTrackingComponent implements OnInit {
    order: any = null;
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private orderService: OrderService,
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params) => {
            this.orderService.getByOrderNumber(params['orderNumber']).subscribe({
                next: (order) => {
                    this.order = order;
                    this.loading = false;
                },
                error: () => (this.loading = false),
            });
        });
    }

    statusSteps = [
        { key: 'pending', label: 'Pesanan Dibuat' },
        { key: 'waiting_payment', label: 'Menunggu Pembayaran' },
        { key: 'paid', label: 'Pembayaran Dikonfirmasi' },
        { key: 'processing', label: 'Diproses' },
        { key: 'shipped', label: 'Dikirim' },
        { key: 'delivered', label: 'Selesai' },
    ];

    get currentStepIndex(): number {
        const idx = this.statusSteps.findIndex((s) => s.key === this.order?.status);
        return idx >= 0 ? idx : 0;
    }

    get statusLabel(): string {
        const step = this.statusSteps[this.currentStepIndex];
        return step?.label || this.order?.status || '';
    }
}
