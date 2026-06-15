import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

export interface AuditLog {
    id: string;
    userId: string;
    userEmail: string;
    action: string;
    resource: string;
    resourceId: string;
    detail: string;
    ip: string;
    createdAt: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        last_page: number;
        pageSize: number;
    };
}

@Injectable({ providedIn: 'root' })
export class AuditLogService {
    private http = inject(HttpClient);

    getLogs(params: {
        page?: number;
        limit?: number;
        keyword?: string;
    }): Observable<PaginatedResponse<AuditLog>> {
        const cleanParams: Record<string, string> = {};
        if (params.page) cleanParams['page'] = String(params.page);
        if (params.limit) cleanParams['limit'] = String(params.limit);
        if (params.keyword) cleanParams['keyword'] = params.keyword;
        return this.http.get<PaginatedResponse<AuditLog>>(
            `${environment.apiUrl}/audit-logs`,
            { params: cleanParams },
        );
    }
}
