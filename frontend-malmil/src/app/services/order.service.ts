import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartService } from './cart.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
    private api = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private cartService: CartService,
    ) {}

    createOrder(data: any): Observable<any> {
        const headers = { 'x-session-id': this.cartService['sessionId'] };
        return this.http.post(`${this.api}/orders`, data, { headers });
    }

    getByOrderNumber(orderNumber: string): Observable<any> {
        return this.http.get(`${this.api}/orders/${orderNumber}`);
    }

    getMyOrders(page = 1, limit = 10): Observable<any> {
        return this.http.get(`${this.api}/my-orders`, { params: { page, limit } });
    }
}
