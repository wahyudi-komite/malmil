import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { AdminUsersService, Role } from './users.service';

@Component({
    selector: 'admin-users',
    standalone: true,
    templateUrl: './users.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        FormsModule, DatePipe, NgForOf, NgIf,
        MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule,
        MatTableModule, MatPaginatorModule, MatSelectModule, MatMenuModule,
    ],
})
export class UsersComponent implements OnInit {
    displayedColumns = ['name', 'email', 'role', 'active', 'created', 'actions'];
    data: any[] = [];
    total = 0;
    page = 1;
    pageSize = 25;
    keyword = '';
    roles: Role[] = [];

    // Create modal
    showForm = false;
    form = { name: '', email: '', password: '', role_id: '' };
    saving = false;

    // Password modal
    passwordTarget: any = null;
    newPassword = '';
    savingPassword = false;

    constructor(private service: AdminUsersService) {}

    ngOnInit() {
        this.load();
        this.service.getRoles().subscribe((r) => (this.roles = r));
    }

    load() {
        const params: any = { page: this.page, limit: this.pageSize };
        if (this.keyword) params.keyword = this.keyword;
        this.service.getUsers(params).subscribe((res) => {
            this.data = res.data || [];
            this.total = res.meta?.total || 0;
        });
    }

    search() { this.page = 1; this.load(); }

    onPage(e: PageEvent) { this.page = e.pageIndex + 1; this.pageSize = e.pageSize; this.load(); }

    openNew() {
        this.form = { name: '', email: '', password: '', role_id: '' };
        this.showForm = true;
    }

    save() {
        this.saving = true;
        this.service.createUser(this.form).subscribe({
            next: () => { this.saving = false; this.showForm = false; this.load(); },
            error: () => (this.saving = false),
        });
    }

    openPassword(user: any) {
        this.passwordTarget = user;
        this.newPassword = '';
    }

    changePassword() {
        if (!this.newPassword || this.newPassword.length < 8) return;
        this.savingPassword = true;
        this.service.changePassword(this.passwordTarget.id, this.newPassword).subscribe({
            next: () => { this.savingPassword = false; this.passwordTarget = null; },
            error: () => (this.savingPassword = false),
        });
    }
}
