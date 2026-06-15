import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RegionService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getProvinces(): Observable<any[]> {
        return this.http.get<any[]>(`${this.api}/shipping/provinces`);
    }

    getCities(provinceId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.api}/shipping/cities/${provinceId}`);
    }

    getDistricts(cityId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.api}/shipping/districts/${cityId}`);
    }
}
