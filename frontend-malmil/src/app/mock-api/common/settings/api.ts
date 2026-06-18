import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { settingsData } from 'app/mock-api/common/settings/data';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class SettingsMockApi {
    private _settings: any = cloneDeep(settingsData);

    constructor(private _fuseMockApiService: FuseMockApiService) {
        this.registerHandlers();
    }

    registerHandlers(): void {
        this._fuseMockApiService
            .onGet('api/v1/admin/settings')
            .reply(() => [200, cloneDeep(this._settings)]);

        this._fuseMockApiService
            .onPut('api/v1/admin/settings')
            .reply(({ request }) => {
                const body: any[] = request.body as any[];
                for (const item of body) {
                    const existing = this._settings.find((s: any) => s.key === item.key);
                    if (existing) {
                        existing.value = item.value;
                    } else {
                        this._settings.push({ key: item.key, value: item.value, group: 'general' });
                    }
                }
                return [200, true];
            });
    }
}
