import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class DatalistService {
    url = `${environment.apiUrl}/datalist`;

    private _httpClient = inject(HttpClient);
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);

    // get data$(): Observable<DatatablesResponse> {
    //     return this._data.asObservable();
    // }

    getData(): Observable<any> {
        return this._httpClient.get(this.url).pipe(
            tap((response: any) => {
                this._data.next(response);
            }),
            catchError((error) => {
                console.error('Error fetching user data', error);
                return throwError(() => new Error('Error fetching user data')); // Throw an error
            })
        );
    }

    // get(): Observable<DatatablesResponse> {
    //     console.log('res');
    //     return this._httpClient.get<DatatablesResponse>(this.url).pipe(
    //         tap((res: DatatablesResponse) => {
    //             this._data.next(res);
    //         }),
    //         catchError((error) => {
    //             console.error('Error fetching user data', error);
    //             return throwError(() => new Error('Error fetching user data')); // Throw an error
    //         })
    //     );
    // }
}
