import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { catchError, debounceTime, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractService {
  abstract get url(): string;

  constructor(protected http: HttpClient) {}

  all(
    page?: number,
    limit?: number,
    direction?: string,
    sort?: string,
    find?: string,
    filterParams?: any
  ): Observable<any> {
    let params = new HttpParams();
    page ? (params = params.append('page', String(page))) : params;
    limit ? (params = params.append('limit', String(limit))) : params;
    sort ? (params = params.append('sort', String(sort))) : params;
    direction
      ? (params = params.append('direction', String(direction)))
      : params;
    find ? (params = params.append('keyword', String(find))) : params;
    if (filterParams) {
      const objectArray = Object.entries(filterParams);
      objectArray.forEach(([key, value]) => {
        if (value != null) {
          params = params.append(key, String(value));
        }
      });
    }
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

  getAll(
    direction: string,
    sort: string,
    field?: string,
    keyword?: string | number
  ): Observable<any> {
    let params = new HttpParams();
    params = params.append('sort', String(sort));
    params = params.append('direction', String(direction));

    field ? (params = params.append('field', String(field))) : params;
    keyword ? (params = params.append('keyword', keyword)) : params;

    return this.http.get(`${this.url}/all`, { params });
  }
}
