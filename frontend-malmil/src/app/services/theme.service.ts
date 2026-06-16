import { Injectable } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    constructor(private _fuseConfig: FuseConfigService) {
        const stored = localStorage.getItem('malmil-scheme');
        if (stored === 'dark' || stored === 'light') {
            this._fuseConfig.config = { scheme: stored };
        }
    }

    toggle() {
        const current = localStorage.getItem('malmil-scheme');
        const next = current === 'dark' ? 'light' : 'dark';
        this._fuseConfig.config = { scheme: next };
    }
}
