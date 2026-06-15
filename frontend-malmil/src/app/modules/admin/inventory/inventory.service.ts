import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface StockSummary {
    total_variants: number;
    total_stock: number;
    low_stock_count: number;
}

export interface VariantStock {
    id: string;
    sku: string;
    name: string;
    product_name: string;
    product_id: string;
    stock_qty: number;
    low_stock_threshold: number;
    is_active: boolean;
}

export interface InventoryLogEntry {
    id: string;
    change_qty: number;
    reason: string;
    reference_type: string;
    reference_id: string;
    created_at: string;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getSummary(): Observable<StockSummary> {
        return this.http.get<StockSummary>(`${this.api}/admin/inventory/summary`);
    }

    getLowStock(threshold?: number): Observable<VariantStock[]> {
        const params: any = {};
        if (threshold) params.threshold = threshold;
        return this.http.get<VariantStock[]>(`${this.api}/admin/inventory/low-stock`, { params });
    }

    getVariants(params: any): Observable<{ data: VariantStock[]; meta: any }> {
        return this.http.get<any>(`${this.api}/admin/inventory/variants`, { params });
    }

    getHistory(variantId: string): Observable<InventoryLogEntry[]> {
        return this.http.get<InventoryLogEntry[]>(`${this.api}/admin/inventory/history/${variantId}`);
    }
}
