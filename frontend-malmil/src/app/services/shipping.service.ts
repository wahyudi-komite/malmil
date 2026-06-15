import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ShippingService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getAddresses(): Observable<any[]> {
        return this.http.get<any[]>(`${this.api}/addresses`);
    }

    createAddress(data: any): Observable<any> {
        return this.http.post(`${this.api}/addresses`, data);
    }

    updateAddress(id: string, data: any): Observable<any> {
        return this.http.put(`${this.api}/addresses/${id}`, data);
    }

    deleteAddress(id: string): Observable<void> {
        return this.http.delete<void>(`${this.api}/addresses/${id}`);
    }

    getCouriers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.api}/couriers`);
    }

    calculateRates(data: { destination: string; weight: number; couriers?: string[] }): Observable<any> {
        return this.http.post(`${this.api}/shipping/rates`, data);
    }

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
