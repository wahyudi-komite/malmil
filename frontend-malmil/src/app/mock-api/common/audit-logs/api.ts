import { Injectable } from '@angular/core';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { auditLogsData } from 'app/mock-api/common/audit-logs/data';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class AuditLogsMockApi {
    private _auditLogs: any[] = cloneDeep(auditLogsData);

    constructor(private _fuseMockApiService: FuseMockApiService) {
        this.registerHandlers();
    }

    registerHandlers(): void {
        this._fuseMockApiService
            .onGet('api/v1/audit-logs')
            .reply(({ request }) => {
                const params: any = {};
                const url = new URL(request.url, window.location.origin);
                url.searchParams.forEach((v, k) => (params[k] = v));

                let data = cloneDeep(this._auditLogs);

                if (params.keyword) {
                    const kw = params.keyword.toLowerCase();
                    data = data.filter((d) =>
                        d.userEmail.toLowerCase().includes(kw) ||
                        d.action.toLowerCase().includes(kw) ||
                        d.resource.toLowerCase().includes(kw)
                    );
                }

                if (params.action) {
                    data = data.filter((d) => d.action === params.action);
                }

                const total = data.length;
                const page = +params.page || 1;
                const limit = +params.limit || 25;
                const start = (page - 1) * limit;
                const paged = data.slice(start, start + limit);

                return [200, {
                    data: paged,
                    meta: { total, page, last_page: Math.ceil(total / limit), pageSize: limit },
                }];
            });
    }
}
