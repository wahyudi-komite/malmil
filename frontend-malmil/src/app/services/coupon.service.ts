import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CouponService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) {}

    validate(code: string, subtotal: number): Observable<any> {
        return this.http.post(`${this.api}/coupons/validate`, { code, subtotal });
    }
}
