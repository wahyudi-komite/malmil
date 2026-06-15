import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface Order {
    id: string;
    order_number: string;
    status: string;
    subtotal: number;
    shipping_cost: number;
    discount_amount: number;
    total: number;
    notes?: string;
    tracking_number?: string;
    courier_code?: string;
    courier_service?: string;
    guest_name?: string;
    guest_email?: string;
    guest_phone?: string;
    address?: any;
    items?: OrderItem[];
    payment?: any;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    product_name: string;
    variant_name: string;
    price: number;
    quantity: number;
    weight_grams: number;
}

export type OrderStatus = 'pending' | 'waiting_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

@Injectable({ providedIn: 'root' })
export class AdminOrdersService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getOrders(params: any): Observable<any> {
        return this.http.get(`${this.api}/admin/orders`, { params });
    }

    updateStatus(id: string, data: { status: OrderStatus; tracking_number?: string; notes?: string }): Observable<any> {
        return this.http.put(`${this.api}/admin/orders/${id}/status`, data);
    }
}
