import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface Role {
    id: string;
    name: string;
    created_at: string;
    permissions?: Permission[];
}

export interface Permission {
    id: string;
    name: string;
    guard_name: string;
    icon?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminRolesService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getAllPermissions(): Observable<Permission[]> {
        return this.http.get<Permission[]>(`${this.api}/permissions/all`);
    }

    createPermission(data: { name: string; guard_name?: string; icon?: string }): Observable<Permission> {
        return this.http.post<Permission>(`${this.api}/permissions`, data);
    }

    updatePermission(id: string, data: { name?: string; guard_name?: string; icon?: string }): Observable<void> {
        return this.http.put<void>(`${this.api}/permissions/${id}`, data);
    }

    deletePermission(id: string): Observable<void> {
        return this.http.delete<void>(`${this.api}/permissions/${id}`);
    }

    getRoles(params: any): Observable<any> {
        return this.http.get(`${this.api}/roles`, { params });
    }

    getPermissions(params: any): Observable<any> {
        return this.http.get(`${this.api}/permissions`, { params });
    }

    getRole(id: string): Observable<Role> {
        return this.http.get<Role>(`${this.api}/roles/${id}`);
    }

    createRole(data: { name: string }): Observable<Role> {
        return this.http.post<Role>(`${this.api}/roles`, data);
    }

    updateRole(id: string, name: string, permissionIds: string[]): Observable<void> {
        return this.http.put<void>(`${this.api}/roles/${id}`, { name, permissions: permissionIds });
    }

    deleteRole(id: string): Observable<void> {
        return this.http.delete<void>(`${this.api}/roles/${id}`);
    }
}
