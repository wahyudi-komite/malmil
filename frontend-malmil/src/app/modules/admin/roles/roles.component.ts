import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AdminRolesService, Permission } from './roles.service';

type Tab = 'roles' | 'permissions';

@Component({
    selector: 'admin-roles',
    standalone: true,
    templateUrl: './roles.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        FormsModule, DatePipe, NgIf, NgForOf,
        MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule,
        MatTableModule, MatPaginatorModule,
    ],
})
export class RolesComponent implements OnInit {
    activeTab: Tab = 'roles';

    rolesCols = ['name', 'permissions_count', 'created', 'actions'];
    roles: any[] = [];
    rolesTotal = 0;
    rolesPage = 1;
    rolesPageSize = 25;
    rolesKeyword = '';
    showRoleForm = false;
    roleFormName = '';
    roleFormPermissions: string[] = [];
    editingRole: any = null;
    savingRole = false;
    allPermissions: Permission[] = [];

    permCols = ['name', 'guard', 'created', 'actions'];
    permissions: any[] = [];
    permTotal = 0;
    permPage = 1;
    permPageSize = 25;
    permKeyword = '';
    showPermForm = false;
    permForm = { name: '', guard_name: 'web', icon: '' };
    editingPerm: any = null;
    savingPerm = false;

    constructor(
        private service: AdminRolesService,
        private _fuseConfirmationService: FuseConfirmationService,
    ) {}

    ngOnInit() {
        this.loadRoles();
        this.loadPermissions();
        this.service.getAllPermissions().subscribe((p) => (this.allPermissions = p));
    }

    // === ROLES ===
    loadRoles() {
        const params: any = { page: this.rolesPage, limit: this.rolesPageSize };
        if (this.rolesKeyword) params.keyword = this.rolesKeyword;
        this.service.getRoles(params).subscribe((res) => {
            this.roles = res.data || [];
            this.rolesTotal = res.meta?.total || 0;
        });
    }

    searchRoles() { this.rolesPage = 1; this.loadRoles(); }

    onRolesPage(e: PageEvent) { this.rolesPage = e.pageIndex + 1; this.rolesPageSize = e.pageSize; this.loadRoles(); }

    openNewRole() {
        this.editingRole = null;
        this.roleFormName = '';
        this.roleFormPermissions = [];
        this.showRoleForm = true;
    }

    openEditRole(id: string) {
        this.service.getRole(id).subscribe((r) => {
            this.editingRole = r;
            this.roleFormName = r.name;
            this.roleFormPermissions = r.permissions?.map((p) => p.id) || [];
            this.showRoleForm = true;
        });
    }

    saveRole() {
        this.savingRole = true;
        if (this.editingRole) {
            this.service.updateRole(this.editingRole.id, this.roleFormName, this.roleFormPermissions).subscribe({
                next: () => { this.savingRole = false; this.showRoleForm = false; this.loadRoles(); },
                error: () => (this.savingRole = false),
            });
        } else {
            this.service.createRole({ name: this.roleFormName }).subscribe({
                next: (r) => {
                    if (this.roleFormPermissions.length) {
                        this.service.updateRole(r.id, r.name, this.roleFormPermissions).subscribe({
                            next: () => { this.savingRole = false; this.showRoleForm = false; this.loadRoles(); },
                            error: () => (this.savingRole = false),
                        });
                    } else {
                        this.savingRole = false;
                        this.showRoleForm = false;
                        this.loadRoles();
                    }
                },
                error: () => (this.savingRole = false),
            });
        }
    }

    deleteRole(id: string) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Hapus Role',
            message: 'Hapus role ini?',
            icon: { show: true, name: 'heroicons_outline:exclamation-triangle', color: 'warn' },
            actions: { confirm: { show: true, label: 'Hapus', color: 'warn' }, cancel: { show: true, label: 'Batal' } },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.service.deleteRole(id).subscribe(() => this.loadRoles());
            }
        });
    }

    togglePerm(id: string) {
        const idx = this.roleFormPermissions.indexOf(id);
        if (idx >= 0) this.roleFormPermissions.splice(idx, 1);
        else this.roleFormPermissions.push(id);
    }

    groupedPermissions(): { group: string; perms: Permission[] }[] {
        const groups: Record<string, Permission[]> = {};
        for (const p of this.allPermissions) {
            const g = p.guard_name || 'web';
            if (!groups[g]) groups[g] = [];
            groups[g].push(p);
        }
        return Object.entries(groups).map(([group, perms]) => ({ group, perms }));
    }

    // === PERMISSIONS ===
    loadPermissions() {
        const params: any = { page: this.permPage, limit: this.permPageSize };
        if (this.permKeyword) params.keyword = this.permKeyword;
        this.service.getPermissions(params).subscribe((res) => {
            this.permissions = res.data || [];
            this.permTotal = res.meta?.total || 0;
        });
    }

    searchPerms() { this.permPage = 1; this.loadPermissions(); }

    onPermsPage(e: PageEvent) { this.permPage = e.pageIndex + 1; this.permPageSize = e.pageSize; this.loadPermissions(); }

    openNewPerm() {
        this.editingPerm = null;
        this.permForm = { name: '', guard_name: 'web', icon: '' };
        this.showPermForm = true;
    }

    openEditPerm(p: any) {
        this.editingPerm = p;
        this.permForm = { name: p.name, guard_name: p.guard_name || 'web', icon: p.icon || '' };
        this.showPermForm = true;
    }

    savePerm() {
        this.savingPerm = true;
        if (this.editingPerm) {
            this.service.updatePermission(this.editingPerm.id, this.permForm).subscribe({
                next: () => { this.savingPerm = false; this.showPermForm = false; this.loadPermissions(); this.loadAllPerms(); },
                error: () => (this.savingPerm = false),
            });
        } else {
            this.service.createPermission(this.permForm).subscribe({
                next: () => { this.savingPerm = false; this.showPermForm = false; this.loadPermissions(); this.loadAllPerms(); },
                error: () => (this.savingPerm = false),
            });
        }
    }

    deletePerm(id: string) {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Hapus Permission',
            message: 'Hapus permission ini?',
            icon: { show: true, name: 'heroicons_outline:exclamation-triangle', color: 'warn' },
            actions: { confirm: { show: true, label: 'Hapus', color: 'warn' }, cancel: { show: true, label: 'Batal' } },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.service.deletePermission(id).subscribe(() => { this.loadPermissions(); this.loadAllPerms(); });
            }
        });
    }

    private loadAllPerms() {
        this.service.getAllPermissions().subscribe((p) => (this.allPermissions = p));
    }
}
