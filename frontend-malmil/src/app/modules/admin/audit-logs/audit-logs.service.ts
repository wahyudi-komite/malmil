import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface AuditLog {
    id: string;
    userId: string;
    userEmail: string;
    action: string;
    resource: string;
    resourceId: string;
    description: string;
    ip: string;
    created_at: string;
}

@Injectable({ providedIn: 'root' })
export class AuditLogsService {
    private api = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getLogs(params: any): Observable<{ data: AuditLog[]; meta: any }> {
        return this.http.get<any>(`${this.api}/audit-logs`, { params });
    }
}
