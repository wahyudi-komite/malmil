import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import {
    AllCommunityModule,
    ColDef,
    GridReadyEvent,
    ModuleRegistry,
    SortChangedEvent,
} from 'ag-grid-community';
import { Subject } from 'rxjs';
// import { User } from '../../../../core/user/user.types';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../../core/user/user.service';
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
    providers: [DatePipe],
})
export class TestComponent implements OnInit {
    user: User;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    _datalistService = inject(DatalistService);
    _userService = inject(UserService);

    private gridApi: any;
    private sortField: string = '';
    private sortOrder: string = '';

    rowData: any[] = [];
    quickFilterText = '';
    defaultColDef = {
        sortable: true,
        filter: true,
        floatingFilter: true,
        floatingFilterComponentParams: {
            suppressFilterButton: true,
        },
        cellStyle: {
            backgroundColor: 'white',
            color: 'black',
            textAlign: 'right',
        },
        editable: true,
        resizable: true,
    };

    columnDefs: ColDef[] = [
        {
            headerName: 'Actions',
            field: 'actions',
            // cellClass: 'text-center my-1',
            sortable: false,
            filter: false,
            resizable: false,
            cellRenderer: (params) => {
                return `<button class="edit-btn leading-normal px-2 py-1 cursor-pointer rounded text-white text-center bg-blue-900">Edit</button>`;
            },
            pinned: 'left',
        },
        {
            headerName: 'ID',
            field: 'id',
            sortable: true,
            filter: false,
            cellClass: 'text-right',
        },
        {
            headerName: 'Create Time',
            field: 'create',
            sortable: true,
            filter: 'agDateColumnFilter',
            minWidth: 180,
            valueFormatter: (params: any) =>
                new DatePipe('id-ID').transform(
                    params.value,
                    'dd-MM-yyyy HH:mm:ss'
                ),
        },
        {
            headerName: 'Time Job',
            field: 'timejob',
            sortable: true,
            filter: 'agDateColumnFilter',
            minWidth: 180,
            valueFormatter: (params: any) =>
                new DatePipe('id-ID').transform(
                    params.value,
                    'dd-MM-yyyy HH:mm:ss'
                ),
        },
        {
            headerName: 'RW Volt',
            field: 'rw_volt',
            sortable: true,
            filter: 'agNumberColumnFilter',
            cellClass: 'text-right',
            valueFormatter: (params) => `${(params.value / 10).toFixed(2)} V`,
        },
        {
            headerName: 'YW Volt',
            field: 'yw_volt',
            sortable: true,
            filter: 'agNumberColumnFilter',
            cellClass: 'text-right',
            valueFormatter: (params) => `${(params.value / 10).toFixed(2)} V`,
        },
        {
            headerName: 'BW Volt',
            field: 'bw_volt',
            sortable: true,
            filter: 'agNumberColumnFilter',
            cellClass: 'text-right',
            valueFormatter: (params) => `${(params.value / 10).toFixed(2)} V`,
        },
        {
            headerName: 'RY Volt',
            field: 'ry_volt',
            sortable: true,
            filter: 'agNumberColumnFilter',
            cellClass: 'text-right',
            valueFormatter: (params) => `${(params.value / 10).toFixed(2)} V`,
        },
        {
            headerName: 'YB Volt',
            field: 'yb_volt',
            sortable: true,
            filter: 'agNumberColumnFilter',
            cellClass: 'text-right',
            valueFormatter: (params) => `${(params.value / 10).toFixed(2)} V`,
        },
        {
            headerName: 'BR Volt',
            field: 'br_volt',
            sortable: true,
            filter: 'agNumberColumnFilter',
            cellClass: 'text-right',
            valueFormatter: (params) => `${(params.value / 10).toFixed(2)} V`,
        },
        {
            headerName: 'R Ampere',
            field: 'r_ampere',
            sortable: true,
            filter: 'agNumberColumnFilter',
            cellClass: 'text-right',
            valueFormatter: (params) => `${(params.value / 10).toFixed(2)} A`,
        },
        {
            headerName: 'Y Ampere',
            field: 'y_ampere',
            sortable: true,
            filter: 'agNumberColumnFilter',
            cellClass: 'text-right',
            valueFormatter: (params) => `${(params.value / 10).toFixed(2)} A`,
        },
        {
            headerName: 'B Ampere',
            field: 'b_ampere',
            sortable: true,
            filter: 'agNumberColumnFilter',
            cellClass: 'text-right',
            valueFormatter: (params) => `${(params.value / 10).toFixed(2)} A`,
            floatingFilterComponentParams: {
                suppressFilterButton: true,
            },
            cellStyle: { backgroundColor: 'white', color: 'black' },
        },
        {
            headerName: 'W Ampere',
            field: 'w_ampere',
            sortable: true,
            filter: 'agNumberColumnFilter',
            cellClass: 'text-right',
            valueFormatter: (params) => `${(params.value / 10).toFixed(2)} A`,
        },
        {
            headerName: 'WH Power Received',
            field: 'wh_powerrecv',
            sortable: true,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Active Power',
            field: 'active_power',
            sortable: true,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Apparent Power',
            field: 'apparent_power',
            sortable: true,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Reactive Power',
            field: 'reactive_power',
            sortable: true,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Power Factor',
            field: 'power_factor',
            sortable: true,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Frequency',
            field: 'freq',
            sortable: true,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'HD1 Temp',
            field: 'hd1_temp',
            sortable: true,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'HD1 Humidity',
            field: 'hd1_hum',
            sortable: true,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'HD2 Temp',
            field: 'hd2_temp',
            sortable: true,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'HD2 Humidity',
            field: 'hd2_hum',
            sortable: true,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'HD3 Temp',
            field: 'hd3_temp',
            sortable: true,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: 'Line Run',
            field: 'line_run',
            sortable: true,
            filter: 'agNumberColumnFilter',
        },
    ];

    ngOnInit(): void {
        // this._userService.user$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((user: User) => {
        //         this.user = user;
        //     });
    }

    onGridReady(params: GridReadyEvent) {
        this.gridApi = params.api;
        this.fetchData();
    }

    exportToCSV() {
        const timestamp = new Date()
            .toISOString()
            .replace(/T/, '_')
            .replace(/:/g, '-')
            .split('.')[0];
        this.gridApi.exportDataAsCsv({
            fileName: `Report_${timestamp}.csv`,
            columnSeparator: '|',
        });
    }

    exportToExcel() {
        const timestamp = new Date()
            .toISOString()
            .replace(/T/, '_')
            .replace(/:/g, '-')
            .split('.')[0];
        this.gridApi.exportDataAsExcel({
            fileName: `Report_${timestamp}.xlsx`,
        });
    }

    onSortChanged(event: SortChangedEvent) {
        const sortModel = this.gridApi.getSortModel();

        if (sortModel.length > 0) {
            this.sortField = sortModel[0].colId;
            this.sortOrder = sortModel[0].sort.toUpperCase(); // 'asc' -> 'ASC', 'desc' -> 'DESC'
        } else {
            this.sortField = '';
            this.sortOrder = '';
        }

        this.fetchData();
    }

    fetchData() {
        this._datalistService
            .getData(1, 10, this.sortField, this.sortOrder)
            .subscribe((data: any) => {
                console.log(data);

                this.rowData = data.data;
            });
    }
}
