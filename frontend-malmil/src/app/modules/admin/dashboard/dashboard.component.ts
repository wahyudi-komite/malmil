import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgForOf, NgIf, DecimalPipe, DatePipe, PercentPipe } from '@angular/common';
import { AdminDashboardService } from './dashboard.service';

@Component({
    selector: 'admin-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [RouterLink, NgForOf, NgIf, DecimalPipe, DatePipe, PercentPipe],
})
export class DashboardComponent implements OnInit {
    data: any = null;
    revenueData: any[] = [];
    loading = true;
    days = 7;

    constructor(private service: AdminDashboardService) {}

    ngOnInit() {
        this.service.getDashboard().subscribe({
            next: (d) => { this.data = d; this.loading = false; },
            error: () => {
                this.data = this.fallbackData;
                this.loading = false;
            },
        });
        this.loadChart();
    }

    get fallbackData() {
        return {
            total_orders: 0, total_revenue: 0, total_products: 0,
            average_order_value: 0, today_orders: 0, today_revenue: 0,
            recent_orders: [],
            low_stock: [],
            orders_by_status: { pending: 0, waiting_payment: 0, paid: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 },
            top_products: [],
            recent_activity: [],
            alerts: { pending_today: 0 },
        };
    }

    loadChart() {
        this.service.getRevenueChart(this.days).subscribe((d) => (this.revenueData = d));
    }

    get maxRevenue(): number {
        return Math.max(...this.revenueData.map((p) => p.revenue), 1);
    }

    get statusClass(): Record<string, string> {
        return {
            pending: 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200',
            waiting_payment: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
            paid: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
            processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
            shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
            delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        };
    }

    get statusDot(): Record<string, string> {
        return {
            pending: 'bg-gray-400',
            waiting_payment: 'bg-amber-400',
            paid: 'bg-green-400',
            processing: 'bg-blue-400',
            shipped: 'bg-indigo-400',
            delivered: 'bg-emerald-400',
            cancelled: 'bg-red-400',
        };
    }

    get statusKeys(): string[] {
        return ['pending', 'waiting_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
    }

    get statusLabel(): Record<string, string> {
        return {
            pending: 'Pending',
            waiting_payment: 'Menunggu Pembayaran',
            paid: 'Dibayar',
            processing: 'Diproses',
            shipped: 'Dikirim',
            delivered: 'Selesai',
            cancelled: 'Dibatalkan',
        };
    }

    activityDot(action: string): string {
        const colors: Record<string, string> = {
            create: 'bg-green-400',
            update: 'bg-blue-400',
            delete: 'bg-red-400',
            login: 'bg-purple-400',
            payment: 'bg-amber-400',
        };
        for (const key of Object.keys(colors)) {
            if (action?.toLowerCase().includes(key)) return colors[key];
        }
        return 'bg-gray-400';
    }
}
