import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BannerService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getActive(position?: string): Observable<any[]> {
        const params: any = {};
        if (position) params.position = position;
        return this.http.get<any[]>(`${this.api}/banners`, { params });
    }
}
