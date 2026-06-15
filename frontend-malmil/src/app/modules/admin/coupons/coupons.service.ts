import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface Coupon {
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    min_order?: number;
    max_discount?: number;
    usage_limit?: number;
    used_count: number;
    is_active: boolean;
    starts_at?: string;
    expires_at?: string;
    created_at: string;
}

@Injectable({ providedIn: 'root' })
export class AdminCouponsService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getCoupons(params: any): Observable<any> {
        return this.http.get(`${this.api}/admin/coupons`, { params });
    }

    getCoupon(id: string): Observable<Coupon> {
        return this.http.get<Coupon>(`${this.api}/admin/coupons/${id}`);
    }

    createCoupon(data: any): Observable<Coupon> {
        return this.http.post<Coupon>(`${this.api}/admin/coupons`, data);
    }

    updateCoupon(id: string, data: any): Observable<Coupon> {
        return this.http.put<Coupon>(`${this.api}/admin/coupons/${id}`, data);
    }

    deleteCoupon(id: string): Observable<void> {
        return this.http.delete<void>(`${this.api}/admin/coupons/${id}`);
    }
}
