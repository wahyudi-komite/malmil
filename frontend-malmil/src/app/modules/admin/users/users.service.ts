import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    is_active: boolean;
    role?: { id: string; name: string };
    created_at: string;
}

export interface Role {
    id: string;
    name: string;
}

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getUsers(params: any): Observable<any> {
        return this.http.get(`${this.api}/users`, { params });
    }

    createUser(data: { name: string; email: string; password: string; role_id: string }): Observable<User> {
        return this.http.post<User>(`${this.api}/users`, data);
    }

    changePassword(id: string, password: string): Observable<any> {
        return this.http.patch(`${this.api}/users/${id}/password`, { password });
    }

    getRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(`${this.api}/roles/all`);
    }
}
