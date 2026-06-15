import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) {}

    subscribe(email: string): Observable<any> {
        return this.http.post(`${this.api}/newsletter/subscribe`, { email });
    }

    unsubscribe(email: string): Observable<any> {
        return this.http.post(`${this.api}/newsletter/unsubscribe`, { email });
    }
}
