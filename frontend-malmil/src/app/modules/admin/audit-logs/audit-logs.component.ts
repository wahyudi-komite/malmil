import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DatePipe, NgForOf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { AuditLogsService } from './audit-logs.service';

@Component({
    selector: 'admin-audit-logs',
    standalone: true,
    templateUrl: './audit-logs.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        FormsModule, DatePipe, NgForOf,
        MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule,
        MatTableModule, MatPaginatorModule, MatSelectModule,
    ],
})
export class AuditLogsComponent implements OnInit {
    displayedColumns = ['action', 'user', 'resource', 'description', 'ip', 'created'];
    data: any[] = [];
    total = 0;
    page = 1;
    pageSize = 25;
    keyword = '';
    actionFilter = '';

    actions = ['LOGIN', 'REGISTER', 'LOGIN_FAILED', 'CREATE', 'UPDATE', 'DELETE', 'CHANGE_PASSWORD',
               'TOKEN_REFRESH', 'TOKEN_SIGN_IN', 'TOKEN_REUSE', 'FORGOT_PASSWORD', 'RESET_PASSWORD',
               'VERIFY_EMAIL', 'VERIFICATION_EMAIL_FAILED', 'RESEND_VERIFICATION'];

    constructor(private service: AuditLogsService) {}

    ngOnInit() { this.load(); }

    load() {
        const params: any = { page: this.page, limit: this.pageSize };
        if (this.keyword) params.keyword = this.keyword;
        if (this.actionFilter) params.action = this.actionFilter;
        this.service.getLogs(params).subscribe((res) => {
            this.data = res.data || [];
            this.total = res.meta?.total || 0;
        });
    }

    search() { this.page = 1; this.load(); }

    onPage(e: PageEvent) { this.page = e.pageIndex + 1; this.pageSize = e.pageSize; this.load(); }

    actionClass(action: string): string {
        if (['CREATE', 'REGISTER', 'VERIFY_EMAIL'].includes(action)) return 'bg-green-100 text-green-800';
        if (['UPDATE', 'CHANGE_PASSWORD', 'RESET_PASSWORD'].includes(action)) return 'bg-blue-100 text-blue-800';
        if (['DELETE'].includes(action)) return 'bg-red-100 text-red-800';
        if (['LOGIN_FAILED', 'TOKEN_REUSE'].includes(action)) return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    }
}
