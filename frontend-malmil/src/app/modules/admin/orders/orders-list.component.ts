import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { AdminOrdersService, OrderStatus } from './orders.service';

@Component({
    selector: 'admin-orders',
    standalone: true,
    templateUrl: './orders-list.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        FormsModule, DatePipe, NgForOf, NgIf,
        MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule,
        MatTableModule, MatPaginatorModule, MatSelectModule, MatMenuModule, MatDialogModule,
    ],
})
export class OrdersListComponent implements OnInit {
    displayedColumns = ['order_number', 'customer', 'total', 'status', 'date', 'actions'];
    data: any[] = [];
    total = 0;
    page = 1;
    pageSize = 25;
    keyword = '';
    statusFilter = '';

    statuses = [
        { value: '', label: 'Semua Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'waiting_payment', label: 'Menunggu Pembayaran' },
        { value: 'paid', label: 'Dibayar' },
        { value: 'processing', label: 'Diproses' },
        { value: 'shipped', label: 'Dikirim' },
        { value: 'delivered', label: 'Selesai' },
        { value: 'cancelled', label: 'Dibatalkan' },
    ];

    // Detail drawer
    selectedOrder: any = null;
    detailLoading = false;

    constructor(private service: AdminOrdersService) {}

    ngOnInit() { this.load(); }

    load() {
        const params: any = { page: this.page, limit: this.pageSize };
        if (this.keyword) params.keyword = this.keyword;
        if (this.statusFilter) params.status = this.statusFilter;
        this.service.getOrders(params).subscribe((res) => {
            this.data = res.data || [];
            this.total = res.total || res.meta?.total || 0;
        });
    }

    search() { this.page = 1; this.load(); }

    onPage(e: PageEvent) {
        this.page = e.pageIndex + 1;
        this.pageSize = e.pageSize;
        this.load();
    }

    openDetail(order: any) {
        this.selectedOrder = order;
    }

    closeDetail() {
        this.selectedOrder = null;
    }

    statusLabel(s: string): string {
        const found = this.statuses.find((st) => st.value === s);
        return found ? found.label : s;
    }

    statusClass(s: string): string {
        const map: Record<string, string> = {
            pending: 'bg-gray-100 text-gray-800',
            waiting_payment: 'bg-amber-100 text-amber-800',
            paid: 'bg-green-100 text-green-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-indigo-100 text-indigo-800',
            delivered: 'bg-emerald-100 text-emerald-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return map[s] || 'bg-gray-100 text-gray-800';
    }

    updateStatus(id: string, status: OrderStatus) {
        const tracking = status === 'shipped' ? prompt('Nomor resi:') : undefined;
        if (status === 'shipped' && !tracking && tracking !== '') return;
        this.service.updateStatus(id, { status, tracking_number: tracking }).subscribe(() => this.load());
    }

    getCustomerName(o: any): string {
        return o.guest_name || o.address?.recipient_name || o.user?.username || '-';
    }
}
