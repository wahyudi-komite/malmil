import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WishlistService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getAll(): Observable<any[]> {
        return this.http.get<any[]>(`${this.api}/wishlist`);
    }

    toggle(productId: string): Observable<any> {
        return this.http.post(`${this.api}/wishlist/${productId}`, {});
    }

    remove(productId: string): Observable<void> {
        return this.http.delete<void>(`${this.api}/wishlist/${productId}`);
    }

    check(productId: string): Observable<{ in_wishlist: boolean }> {
        return this.http.get<{ in_wishlist: boolean }>(`${this.api}/wishlist/check/${productId}`);
    }
}
