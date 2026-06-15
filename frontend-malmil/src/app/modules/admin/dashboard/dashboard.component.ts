import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgForOf, NgIf, DecimalPipe, DatePipe } from '@angular/common';
import { AdminDashboardService } from './dashboard.service';

@Component({
    selector: 'admin-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [RouterLink, NgForOf, NgIf, DecimalPipe, DatePipe],
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
            error: () => (this.loading = false),
        });
        this.loadChart();
    }

    loadChart() {
        this.service.getRevenueChart(this.days).subscribe((d) => (this.revenueData = d));
    }

    get maxRevenue(): number {
        return Math.max(...this.revenueData.map((p) => p.revenue), 1);
    }

    get statusClass(): Record<string, string> {
        return {
            pending: 'bg-gray-100 text-gray-800',
            waiting_payment: 'bg-amber-100 text-amber-800',
            paid: 'bg-green-100 text-green-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-indigo-100 text-indigo-800',
            delivered: 'bg-emerald-100 text-emerald-800',
            cancelled: 'bg-red-100 text-red-800',
        };
    }
}
