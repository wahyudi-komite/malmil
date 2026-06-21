import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { resolveImageUrl } from 'app/core/utils/image-url';
import { AdminBannersService } from './banners.service';

@Component({
    selector: 'admin-banners',
    standalone: true,
    templateUrl: './banners-list.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        FormsModule, DatePipe, NgForOf, NgIf,
        MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule,
        MatTableModule, MatPaginatorModule, MatSelectModule, MatSlideToggleModule, MatMenuModule,
    ],
})
export class BannersListComponent implements OnInit {
    displayedColumns = ['image', 'title', 'position', 'sort', 'active', 'expires', 'actions'];
    data: any[] = [];
    total = 0;
    page = 1;
    pageSize = 25;
    keyword = '';

    // Form modal
    showForm = false;
    isEdit = false;
    form: any = { title: '', subtitle: '', image_url: '', link_url: '', position: 'hero', sort_order: 0, is_active: true, starts_at: '', expires_at: '' };
    uploadProgress = false;
    saving = false;

    positions = ['hero', 'promo_bar', 'sidebar'];
    resolveImageUrl = resolveImageUrl;

    constructor(
        private service: AdminBannersService,
        private _fuseConfirmationService: FuseConfirmationService,
    ) {}

    ngOnInit() { this.load(); }

    load() {
        const params: any = { page: this.page, limit: this.pageSize };
        if (this.keyword) params.keyword = this.keyword;
        this.service.getBanners(params).subscribe((res) => {
            this.data = res.data || [];
            this.total = res.total || res.meta?.total || 0;
        });
    }

    search() { this.page = 1; this.load(); }
    onPage(e: PageEvent) { this.page = e.pageIndex + 1; this.pageSize = e.pageSize; this.load(); }

    openNew() {
        this.isEdit = false;
        this.form = { title: '', subtitle: '', image_url: '', link_url: '', position: 'hero', sort_order: 0, is_active: true, starts_at: '', expires_at: '' };
        this.showForm = true;
    }

    openEdit(b: any) {
        this.isEdit = true;
        this.form = { ...b };
        this.form.starts_at = b.starts_at ? b.starts_at.substring(0, 16) : '';
        this.form.expires_at = b.expires_at ? b.expires_at.substring(0, 16) : '';
        this.showForm = true;
    }

    closeForm() { this.showForm = false; }

    save() {
        this.saving = true;
        const payload = { ...this.form };
        if (!payload.starts_at) delete payload.starts_at;
        if (!payload.expires_at) delete payload.expires_at;
        const obs = this.isEdit
            ? this.service.updateBanner(this.form.id, payload)
            : this.service.createBanner(payload);
        obs.subscribe({ next: () => { this.saving = false; this.closeForm(); this.load(); }, error: () => (this.saving = false) });
    }

    delete(id: string) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Hapus Banner',
            message: 'Hapus banner ini?',
            icon: { show: true, name: 'heroicons_outline:exclamation-triangle', color: 'warn' },
            actions: { confirm: { show: true, label: 'Hapus', color: 'warn' }, cancel: { show: true, label: 'Batal' } },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') this.service.deleteBanner(id).subscribe(() => this.load());
        });
    }

    uploadImage(event: any) {
        const file = event.target.files?.[0];
        if (!file) return;
        this.uploadProgress = true;
        this.service.uploadFile(file).subscribe({
            next: (res) => { this.form.image_url = res.url; this.uploadProgress = false; },
            error: () => (this.uploadProgress = false),
        });
    }
}
