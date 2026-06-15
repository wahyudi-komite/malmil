import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminSettingsService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getSettings(group?: string): Observable<any[]> {
        const params: any = {};
        if (group) params.group = group;
        return this.http.get<any[]>(`${this.api}/admin/settings`, { params });
    }

    updateSettings(settings: Array<{ key: string; value: string; group?: string }>): Observable<any> {
        return this.http.put(`${this.api}/admin/settings`, settings);
    }
}
