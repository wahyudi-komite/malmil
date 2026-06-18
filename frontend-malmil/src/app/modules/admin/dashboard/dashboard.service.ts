import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface DashboardData {
    total_orders: number;
    total_revenue: number;
    total_products: number;
    average_order_value: number;
    today_orders: number;
    today_revenue: number;
    recent_orders: Array<{
        id: string;
        order_number: string;
        total: number;
        status: string;
        customer_name: string;
        created_at: string;
    }>;
    low_stock: Array<{
        variant_id: string;
        variant_name: string;
        sku: string;
        stock_qty: number;
        threshold: number;
        product_name: string;
    }>;
    orders_by_status: Record<string, number>;
    top_products: Array<{
        product_name: string;
        total_sold: number;
        total_revenue: number;
    }>;
    recent_activity: Array<{
        id: string;
        action: string;
        resource: string;
        detail: string;
        user_email: string;
        created_at: string;
    }>;
    alerts: {
        pending_today: number;
    };
}

export interface RevenuePoint {
    date: string;
    revenue: number;
    orders: number;
}

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getDashboard(): Observable<DashboardData> {
        return this.http.get<DashboardData>(`${this.api}/admin/analytics/dashboard`);
    }

    getRevenueChart(days = 7): Observable<RevenuePoint[]> {
        return this.http.get<RevenuePoint[]>(`${this.api}/admin/analytics/revenue-chart`, { params: { days } });
    }
}
