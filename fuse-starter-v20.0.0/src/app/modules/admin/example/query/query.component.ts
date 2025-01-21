import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../../core/user/user.service';
import { User } from '../../../../core/user/user.types';
import { DatatablesResponse } from '../../../../interface/datatables-response';
import { DatalistService } from '../../../../services/datalist.service';

@Component({
    selector: 'app-query',
    standalone: true,
    imports: [DataTablesModule],
    templateUrl: './query.component.html',
    styleUrl: './query.component.scss',
    providers: [DatePipe],
})
export class QueryComponent implements OnInit {
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public pipeDateInstance: DatePipe;
    public pipeCurrencyInstance: CurrencyPipe;

    dtOptions: Config = {};

    _datalistService = inject(DatalistService);
    _userService = inject(UserService);

    dtOptions: ADTSettings = {};

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            ajax: (dataTablesParameters: any, callback) => {
                this._datalistService
                    .getData()
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((res: DatatablesResponse) => {
                        callback({
                            recordsTotal: res.meta.total,
                            // recordsFiltered: res.meta.last_page,
                            data: res.data,
                        });
                    });
            },
            columns: [
                {
                    title: 'Created',
                    data: 'create',
                    render: (data: any) =>
                        this.pipeDateInstance.transform(data, 'mediumDate'),
                },
                {
                    title: 'ID',
                    data: 'rw_volt',
                    ngPipeInstance: this.pipeCurrencyInstance,
                    ngPipeArgs: ['USD', 'symbol'],
                },
                { title: '', data: 'yw_volt' },
                { title: '', data: 'bw_volt' },
                { title: '', data: 'ry_volt' },
                { title: '', data: 'yb_volt' },
                { title: '', data: 'br_volt' },
                { title: '', data: 'r_ampere' },
                { title: '', data: 'y_ampere' },
                { title: '', data: 'b_ampere' },
                { title: '', data: 'w_ampere' },
                { title: '', data: 'wh_powerrecv' },
                { title: '', data: 'active_power' },
                { title: '', data: 'apparent_power' },
                { title: '', data: 'reactive_power' },
                { title: '', data: 'power_factor' },
                { title: '', data: 'freq' },
                { title: '', data: 'hd1_temp' },
                { title: '', data: 'hd1_hum' },
                { title: '', data: 'hd2_temp' },
                { title: '', data: 'hd2_hum' },
                { title: '', data: 'hd3_temp' },
                { title: '', data: 'line_run' },
            ],
        };
    }
}
