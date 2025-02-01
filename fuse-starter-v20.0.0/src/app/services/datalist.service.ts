import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DatalistService {
    url = `${environment.apiUrl}/datalist`;

    private _httpClient = inject(HttpClient);
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    // getData(): Observable<any> {
    //     return this._httpClient.get(this.url).pipe(
    //         tap((response: any) => {
    //             this._data.next(response);
    //         }),
    //         catchError((error) => {
    //             console.error('Error fetching user data', error);
    //             return throwError(() => new Error('Error fetching user data')); // Throw an error
    //         })
    //     );
    // }

    // getData(
    //     page?: number,
    //     limit?: number,
    //     direction?: string,
    //     sort?: string,
    //     find?: string,
    //     filterParams?: any
    // ): Observable<any> {
    //     let params = new HttpParams();
    //     page ? (params = params.append('page', String(page))) : params;
    //     limit ? (params = params.append('limit', String(limit))) : params;
    //     sort ? (params = params.append('sort', String(sort))) : params;
    //     direction
    //         ? (params = params.append('direction', String(direction)))
    //         : params;
    //     find ? (params = params.append('keyword', String(find))) : params;
    //     if (filterParams) {
    //         const objectArray = Object.entries(filterParams);
    //         objectArray.forEach(([key, value]) => {
    //             if (value != null) {
    //                 params = params.append(key, String(value));
    //             }
    //         });
    //     }
    //     return this._httpClient.get(this.url, { params });
    // }

    getData(): Observable<any> {
        return this._httpClient.get<any[]>(this.url).subscribe();
    }
}
