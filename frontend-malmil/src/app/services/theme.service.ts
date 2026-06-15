import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly STORAGE_KEY = 'malmil-theme-preference';
    theme = signal<'light' | 'dark'>(this.loadPreference());

    constructor() {
        effect(() => {
            const t = this.theme();
            document.documentElement.classList.toggle('dark', t === 'dark');
            localStorage.setItem(this.STORAGE_KEY, t);
        });
    }

    private loadPreference(): 'light' | 'dark' {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored === 'dark' || stored === 'light') return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    toggle() {
        this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
    }
}
