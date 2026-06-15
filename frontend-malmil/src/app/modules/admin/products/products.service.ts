import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    base_price: number;
    weight_grams?: number;
    is_active: boolean;
    is_featured: boolean;
    sort_order: number;
    category?: { id: string; name: string };
    images?: ProductImage[];
    variants?: ProductVariant[];
    created_at: string;
    updated_at: string;
}

export interface ProductImage {
    id?: string;
    url: string;
    alt_text?: string;
    sort_order?: number;
    is_primary?: boolean;
}

export interface ProductVariant {
    id?: string;
    sku: string;
    name: string;
    price_override?: number;
    weight_grams?: number;
    stock_qty?: number;
    low_stock_threshold?: number;
    is_active?: boolean;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    parent_id?: string;
    is_active: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminProductsService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getProducts(params: any): Observable<any> {
        return this.http.get(`${this.api}/admin/products`, { params });
    }

    getProduct(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.api}/admin/products/${id}`);
    }

    createProduct(data: any): Observable<Product> {
        return this.http.post<Product>(`${this.api}/admin/products`, data);
    }

    updateProduct(id: string, data: any): Observable<Product> {
        return this.http.put<Product>(`${this.api}/admin/products/${id}`, data);
    }

    deleteProduct(id: string): Observable<void> {
        return this.http.delete<void>(`${this.api}/admin/products/${id}`);
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.api}/admin/categories`);
    }

    createCategory(data: any): Observable<Category> {
        return this.http.post<Category>(`${this.api}/admin/categories`, data);
    }

    uploadFile(file: File): Observable<{ url: string; filename: string }> {
        const fd = new FormData();
        fd.append('file', file);
        return this.http.post<any>(`${this.api}/upload`, fd);
    }
}
