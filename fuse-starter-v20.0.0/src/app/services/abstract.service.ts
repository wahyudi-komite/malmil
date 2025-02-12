import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class AbstractService {
    abstract get url(): string;

    constructor(protected http: HttpClient) {}

    private buildHttpParams(
        page?: number,
        limit?: number,
        direction?: string,
        sort?: string,
        find?: string,
        filterParams?: any
    ): HttpParams {
        let params = new HttpParams();
        if (page) params = params.append('page', String(page));
        if (limit) params = params.append('limit', String(limit));
        if (sort) params = params.append('sort', String(sort));
        if (direction) params = params.append('direction', String(direction));
        if (find) params = params.append('keyword', String(find));

        if (filterParams) {
            Object.entries(filterParams).forEach(([key, value]) => {
                if (value != null) {
                    params = params.append(key, String(value));
                }
            });
        }

        return params;
    }

    all(
        page?: number,
        limit?: number,
        direction?: string,
        sort?: string,
        find?: string,
        filterParams?: any
    ): Observable<any> {
        const params = this.buildHttpParams(
            page,
            limit,
            direction,
            sort,
            find,
            filterParams
        );
        return this.http.get(this.url, { params });
    }

    create(data: any): Observable<any> {
        console.log(data);

        return this.http.post(this.url, data);
    }

    get(id: number): Observable<any> {
        return this.http.get(`${this.url}/${id}`);
    }

    update(id: number, data: any): Observable<any> {
        console.log(data);
        return this.http.put(`${this.url}/${id}`, data);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }

    findOne(data: any): Observable<any> {
        return this.http.post(`${this.url}/findName`, data);
    }

    find(data: any): Observable<any> {
        return this.http.post(`${this.url}/findIn`, data);
    }

    exportExcel(
        page?: number,
        limit?: number,
        direction?: string,
        sort?: string,
        find?: string,
        filterParams?: any
    ): void {
        const params = this.buildHttpParams(
            page,
            limit,
            direction,
            sort,
            find,
            filterParams
        );

        this.http
            .get(`${this.url}/excel`, { params, responseType: 'blob' })
            .subscribe(
                (response) => {
                    const blob = new Blob([response], {
                        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    });
                    saveAs(blob, 'Ems-Wa-Line.xlsx');
                },
                (error) => {
                    console.error('Gagal mengunduh file:', error);
                }
            );
    }
}
