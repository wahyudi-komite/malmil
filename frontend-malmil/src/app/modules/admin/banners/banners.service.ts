import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface Banner {
    id: string;
    title: string;
    subtitle?: string;
    image_url: string;
    link_url?: string;
    position: string;
    sort_order: number;
    is_active: boolean;
    starts_at?: string;
    expires_at?: string;
    created_at: string;
}

@Injectable({ providedIn: 'root' })
export class AdminBannersService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getBanners(params: any): Observable<any> {
        return this.http.get(`${this.api}/admin/banners`, { params });
    }

    getBanner(id: string): Observable<Banner> {
        return this.http.get<Banner>(`${this.api}/admin/banners/${id}`);
    }

    createBanner(data: any): Observable<Banner> {
        return this.http.post<Banner>(`${this.api}/admin/banners`, data);
    }

    updateBanner(id: string, data: any): Observable<Banner> {
        return this.http.put<Banner>(`${this.api}/admin/banners/${id}`, data);
    }

    deleteBanner(id: string): Observable<void> {
        return this.http.delete<void>(`${this.api}/admin/banners/${id}`);
    }

    uploadFile(file: File): Observable<{ url: string; filename: string }> {
        const fd = new FormData();
        fd.append('file', file);
        return this.http.post<any>(`${this.api}/upload`, fd);
    }
}
