import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdminSettingsService } from './settings.service';

@Component({
    selector: 'admin-settings',
    standalone: true,
    templateUrl: './settings.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [FormsModule, NgIf, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule],
})
export class SettingsComponent implements OnInit {
    settings: Record<string, string> = {};
    loading = true;
    saving = false;
    saved = false;

    constructor(private service: AdminSettingsService) {}

    ngOnInit() {
        this.service.getSettings().subscribe((list) => {
            for (const s of list) {
                this.settings[s.key] = s.value;
            }
            this.loading = false;
        });
    }

    save() {
        this.saving = true;
        const payload = Object.entries(this.settings).map(([key, value]) => ({ key, value }));
        this.service.updateSettings(payload).subscribe({
            next: () => { this.saving = false; this.saved = true; setTimeout(() => (this.saved = false), 3000); },
            error: () => (this.saving = false),
        });
    }
}
