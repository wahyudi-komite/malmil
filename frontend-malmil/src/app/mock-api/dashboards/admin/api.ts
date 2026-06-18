import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { adminDashboard as adminDashboardData } from 'app/mock-api/dashboards/admin/data';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class AdminDashboardMockApi {
    private _adminDashboard: any = adminDashboardData;

    constructor(private _fuseMockApiService: FuseMockApiService) {
        this.registerHandlers();
    }

    registerHandlers(): void {
        this._fuseMockApiService
            .onGet('api/v1/admin/analytics/dashboard')
            .reply(() => [200, cloneDeep(this._adminDashboard)]);

        this._fuseMockApiService
            .onGet('api/v1/admin/analytics/revenue-chart')
            .reply(() => {
                const data = [];
                const now = new Date();
                for (let i = 6; i >= 0; i--) {
                    const d = new Date(now);
                    d.setDate(d.getDate() - i);
                    data.push({
                        date: d.toISOString().split('T')[0],
                        revenue: Math.floor(Math.random() * 3000000) + 500000,
                        orders: Math.floor(Math.random() * 8) + 1,
                    });
                }
                return [200, data];
            });
    }
}
