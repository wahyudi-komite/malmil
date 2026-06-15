import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) {}

    createTransaction(orderId: string, amount: number, customerDetails?: any): Observable<any> {
        return this.http.post(`${this.api}/payments`, {
            order_id: orderId,
            amount,
            customer_details: customerDetails,
        });
    }

    getPaymentByOrder(orderNumber: string): Observable<any> {
        return this.http.get(`${this.api}/payments/${orderNumber}`);
    }
}
