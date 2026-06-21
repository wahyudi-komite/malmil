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
import { AdminCouponsService } from './coupons.service';

@Component({
    selector: 'admin-coupons',
    standalone: true,
    templateUrl: './coupons-list.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        FormsModule, DatePipe, NgIf,
        MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule,
        MatTableModule, MatPaginatorModule, MatSelectModule, MatSlideToggleModule, MatMenuModule,
    ],
})
export class CouponsListComponent implements OnInit {
    displayedColumns = ['code', 'type', 'value', 'min_order', 'usage', 'status', 'expires', 'actions'];
    data: any[] = [];
    total = 0;
    page = 1;
    pageSize = 25;
    keyword = '';

    // Form modal
    showForm = false;
    isEdit = false;
    form: any = {
        code: '', type: 'percentage', value: 0, min_order: 0, max_discount: 0,
        usage_limit: 0, is_active: true, starts_at: '', expires_at: '',
    };
    saving = false;

    constructor(
        private service: AdminCouponsService,
        private _fuseConfirmationService: FuseConfirmationService,
    ) {}

    ngOnInit() { this.load(); }

    load() {
        const params: any = { page: this.page, limit: this.pageSize };
        if (this.keyword) params.keyword = this.keyword;
        this.service.getCoupons(params).subscribe((res) => {
            this.data = res.data || [];
            this.total = res.total || res.meta?.total || 0;
        });
    }

    search() { this.page = 1; this.load(); }
    onPage(e: PageEvent) { this.page = e.pageIndex + 1; this.pageSize = e.pageSize; this.load(); }

    openNew() {
        this.isEdit = false;
        this.form = { code: '', type: 'percentage', value: 0, min_order: 0, max_discount: 0, usage_limit: 0, is_active: true, starts_at: '', expires_at: '' };
        this.showForm = true;
    }

    openEdit(c: any) {
        this.isEdit = true;
        this.form = { ...c };
        this.form.starts_at = c.starts_at ? c.starts_at.substring(0, 16) : '';
        this.form.expires_at = c.expires_at ? c.expires_at.substring(0, 16) : '';
        this.showForm = true;
    }

    closeForm() { this.showForm = false; }

    save() {
        this.saving = true;
        const payload = { ...this.form };
        if (!payload.starts_at) delete payload.starts_at;
        if (!payload.expires_at) delete payload.expires_at;
        const obs = this.isEdit
            ? this.service.updateCoupon(this.form.id, payload)
            : this.service.createCoupon(payload);
        obs.subscribe({ next: () => { this.saving = false; this.closeForm(); this.load(); }, error: () => (this.saving = false) });
    }

    delete(id: string) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Hapus Kupon',
            message: 'Hapus kupon ini?',
            icon: { show: true, name: 'heroicons_outline:exclamation-triangle', color: 'warn' },
            actions: { confirm: { show: true, label: 'Hapus', color: 'warn' }, cancel: { show: true, label: 'Batal' } },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') this.service.deleteCoupon(id).subscribe(() => this.load());
        });
    }
}
