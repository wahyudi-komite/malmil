import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Cart {
    id: string;
    coupon_code: string | null;
    items: CartItem[];
    subtotal: number;
    total_weight: number;
    total_items: number;
}

export interface CartItem {
    id: string;
    variant_id: string;
    product_name: string;
    variant_name: string;
    sku: string;
    price: number;
    weight_grams: number;
    quantity: number;
    subtotal: number;
    image: string | null;
}

@Injectable({ providedIn: 'root' })
export class CartService {
    private api = environment.apiUrl;
    private sessionId = this.getOrCreateSessionId();
    private cartSubject = new BehaviorSubject<Cart | null>(null);
    cart$ = this.cartSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadCart();
    }

    private getOrCreateSessionId(): string {
        let sid = localStorage.getItem('malmil_session');
        if (!sid) {
            sid = crypto.randomUUID();
            localStorage.setItem('malmil_session', sid);
        }
        return sid;
    }

    private headers() {
        return { 'x-session-id': this.sessionId };
    }

    loadCart() {
        this.http.get<Cart>(`${this.api}/cart`, { headers: this.headers() }).subscribe({
            next: (cart) => this.cartSubject.next(cart),
            error: () => {},
        });
    }

    getCart(): Observable<Cart> {
        return this.http.get<Cart>(`${this.api}/cart`, { headers: this.headers() }).pipe(
            tap((cart) => this.cartSubject.next(cart)),
        );
    }

    addItem(variantId: string, quantity: number): Observable<Cart> {
        return this.http.post<Cart>(`${this.api}/cart/items`, { variant_id: variantId, quantity }, { headers: this.headers() }).pipe(
            tap((cart) => this.cartSubject.next(cart)),
        );
    }

    updateItem(itemId: string, quantity: number): Observable<Cart> {
        return this.http.patch<Cart>(`${this.api}/cart/items/${itemId}`, { quantity }, { headers: this.headers() }).pipe(
            tap((cart) => this.cartSubject.next(cart)),
        );
    }

    removeItem(itemId: string): Observable<Cart> {
        return this.http.delete<Cart>(`${this.api}/cart/items/${itemId}`, { headers: this.headers() }).pipe(
            tap((cart) => this.cartSubject.next(cart)),
        );
    }

    clearCart(): Observable<Cart> {
        return this.http.delete<Cart>(`${this.api}/cart`, { headers: this.headers() }).pipe(
            tap((cart) => this.cartSubject.next(cart)),
        );
    }

    applyCoupon(code: string): Observable<Cart> {
        return this.http.post<Cart>(`${this.api}/cart/apply-coupon`, { code }, { headers: this.headers() }).pipe(
            tap((cart) => this.cartSubject.next(cart)),
        );
    }

    removeCoupon(): Observable<Cart> {
        return this.http.delete<Cart>(`${this.api}/cart/coupon`, { headers: this.headers() }).pipe(
            tap((cart) => this.cartSubject.next(cart)),
        );
    }

    mergeCart(): Observable<Cart> {
        return this.http.post<Cart>(`${this.api}/cart/merge`, {}, { headers: this.headers() }).pipe(
            tap((cart) => this.cartSubject.next(cart)),
        );
    }
}
