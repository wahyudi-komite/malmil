import { Injectable, inject } from '@angular/core';
import { SettingsService } from './settings.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SiteConfigService {
    private settingsService = inject(SettingsService);
    private cache: Record<string, string> | null = null;
    private loading = false;

    waNumber = environment.waNumber;
    instagramUrl = environment.instagramUrl;
    siteName = environment.siteName;

    load() {
        if (this.cache || this.loading) return;
        this.loading = true;
        this.settingsService.getPublic().subscribe({
            next: (settings) => {
                this.cache = settings;
                if (settings['wa_number']) this.waNumber = settings['wa_number'];
                if (settings['instagram_url']) this.instagramUrl = settings['instagram_url'];
                if (settings['site_name']) this.siteName = settings['site_name'];
                this.loading = false;
            },
            error: () => (this.loading = false),
        });
    }
}
