import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
    id: string;
    category: any;
    name: string;
    slug: string;
    description: string;
    base_price: number;
    weight_grams: number;
    is_active: boolean;
    is_featured: boolean;
    images: any[];
    variants: any[];
    created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getProducts(params?: any): Observable<any> {
        return this.http.get(`${this.api}/products`, { params });
    }

    getFeatured(limit = 8): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.api}/products/featured`, { params: { limit } });
    }

    getBySlug(slug: string): Observable<Product> {
        return this.http.get<Product>(`${this.api}/products/${slug}`);
    }

    getCategories(): Observable<any[]> {
        return this.http.get<any[]>(`${this.api}/categories`);
    }

    adminGetProducts(params?: any): Observable<any> {
        return this.http.get(`${this.api}/admin/products`, { params });
    }

    adminCreate(data: any): Observable<Product> {
        return this.http.post<Product>(`${this.api}/admin/products`, data);
    }

    adminUpdate(id: string, data: any): Observable<Product> {
        return this.http.put<Product>(`${this.api}/admin/products/${id}`, data);
    }

    adminDelete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.api}/admin/products/${id}`);
    }
}
