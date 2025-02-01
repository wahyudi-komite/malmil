import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, ModuleRegistry } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { UserService } from '../../../../core/user/user.service';
// import { User } from '../../../../core/user/user.types';
import { DatalistService } from '../../../../services/datalist.service';

ModuleRegistry.registerModules([AllCommunityModule]);

interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}

@Component({
    selector: 'app-test',
    standalone: true,
    imports: [FormsModule, AgGridAngular],
    templateUrl: './test.component.html',
    styleUrl: './test.component.scss',
})
export class TestComponent implements OnInit {
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    rows = [];
    total = 0;
    page = 1;
    pageSize = 10;

    _datalistService = inject(DatalistService);

    users: User[] = [
        {
            id: 1,
            name: 'Alice',
            email: 'alice@example.com',
            createdAt: '2025-01-01',
        },
        {
            id: 2,
            name: 'Bob',
            email: 'bob@example.com',
            createdAt: '2025-01-02',
        },
        {
            id: 3,
            name: 'Charlie',
            email: 'charlie@example.com',
            createdAt: '2025-01-03',
        },
        {
            id: 4,
            name: 'David',
            email: 'david@example.com',
            createdAt: '2025-01-04',
        },
        {
            id: 5,
            name: 'Eve',
            email: 'eve@example.com',
            createdAt: '2025-01-05',
        },
    ];

    filteredUsers = [...this.users];
    limit = 10;
    search = '';
    private gridApi: any;

    columns: ColDef[] = [
        { headerName: 'ID', field: 'id', sortable: true },
        { headerName: 'Name', field: 'name', sortable: true },
        { headerName: 'Email', field: 'email', sortable: true },
        { headerName: 'Created At', field: 'createdAt', sortable: true },
    ];

    constructor(private _userService: UserService) {}

    ngOnInit(): void {
        // this._userService.user$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((user: User) => {
        //         this.user = user;
        //     });
    }

    onGridReady(params: any) {
        this.gridApi = params.api;
    }

    onSort() {
        if (!this.gridApi) return;
        const sortModel = this.gridApi.getSortModel();
        if (sortModel.length > 0) {
            const { colId, sort } = sortModel[0];
            this.filteredUsers.sort((a, b) =>
                sort === 'asc'
                    ? (a[colId as keyof User] as string).localeCompare(
                          b[colId as keyof User] as string
                      )
                    : (b[colId as keyof User] as string).localeCompare(
                          a[colId as keyof User] as string
                      )
            );
        }
    }

    onSearch() {
        this.filteredUsers = this.users.filter(
            (user) =>
                user.name.toLowerCase().includes(this.search.toLowerCase()) ||
                user.email.toLowerCase().includes(this.search.toLowerCase())
        );
    }
}
