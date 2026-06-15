import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { AuditLog, AuditLogService } from './audit-log.service';

@Component({
    selector: 'audit-log',
    standalone: true,
    templateUrl: './audit-log.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatTableModule,
        DatePipe,
    ],
})
export class AuditLogComponent implements OnInit {
    displayedColumns: string[] = ['createdAt', 'userEmail', 'action', 'resource', 'detail', 'ip'];
    data: AuditLog[] = [];
    total = 0;
    page = 1;
    pageSize = 25;
    keyword = '';

    constructor(private auditLogService: AuditLogService) {}

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.auditLogService
            .getLogs({ page: this.page, limit: this.pageSize, keyword: this.keyword || undefined })
            .subscribe((res) => {
                this.data = res.data;
                this.total = res.meta.total;
            });
    }

    search(): void {
        this.page = 1;
        this.load();
    }

    onPageChange(e: PageEvent): void {
        this.page = e.pageIndex + 1;
        this.pageSize = e.pageSize;
        this.load();
    }
}
