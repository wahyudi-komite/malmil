import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { UserService } from '../../../../core/user/user.service';
import { User } from '../../../../core/user/user.types';
import { DatalistService } from '../../../../services/datalist.service';

@Component({
    selector: 'app-query',
    standalone: true,
    imports: [FormsModule, AgGridAngular],
    templateUrl: './query.component.html',
    styleUrl: './query.component.scss',
    providers: [DatePipe],
})
export class QueryComponent implements OnInit {
    user: User;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    _datalistService = inject(DatalistService);
    _userService = inject(UserService);

    rowData: any[] = [];
    columns: ColDef[] = [
        { headerName: 'ID', field: 'id', sortable: true },
        { headerName: 'Create Time', field: 'create', sortable: true },
        { headerName: 'Time Job', field: 'timejob', sortable: true },
        { headerName: 'RW Volt', field: 'rw_volt', sortable: true },
        { headerName: 'YW Volt', field: 'yw_volt', sortable: true },
        { headerName: 'BW Volt', field: 'bw_volt', sortable: true },
        { headerName: 'RY Volt', field: 'ry_volt', sortable: true },
        { headerName: 'YB Volt', field: 'yb_volt', sortable: true },
        { headerName: 'BR Volt', field: 'br_volt', sortable: true },
        { headerName: 'Active Power', field: 'active_power', sortable: true },
        { headerName: 'Power Factor', field: 'power_factor', sortable: true },
    ];

    ngOnInit(): void {
        // this._userService.user$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((user: User) => {
        //         this.user = user;
        //     });
    }
    onGridReady(params: any) {
        // this.gridApi = params.api;
    }

    // onSort() {
    //     if (!this.gridApi) return;
    //     const sortModel = this.gridApi.getSortModel();
    //     if (sortModel.length > 0) {
    //         const { colId, sort } = sortModel[0];
    //         this.filteredUsers.sort((a, b) =>
    //             sort === 'asc'
    //                 ? (a[colId as keyof User] as string).localeCompare(
    //                       b[colId as keyof User] as string
    //                   )
    //                 : (b[colId as keyof User] as string).localeCompare(
    //                       a[colId as keyof User] as string
    //                   )
    //         );
    //     }
    // }

    // onSearch() {
    //     this.filteredUsers = this.users.filter(
    //         (user) =>
    //             user.name.toLowerCase().includes(this.search.toLowerCase()) ||
    //             user.email.toLowerCase().includes(this.search.toLowerCase())
    //     );
    // }
}
