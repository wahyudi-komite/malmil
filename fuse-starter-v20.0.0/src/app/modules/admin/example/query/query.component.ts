import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../../core/user/user.service';
import { User } from '../../../../core/user/user.types';
import { DatalistService } from '../../../../services/datalist.service';
import { DATE_PIPE_TOKEN } from '../../../../tokens/date-pipe.token';

@Component({
    selector: 'app-query',
    standalone: true,
    imports: [NgxDatatableModule],
    templateUrl: './query.component.html',
    styleUrl: './query.component.scss',
    providers: [DatePipe],
})
export class QueryComponent implements OnInit {
    user: User;

    totalItems = 0;
    currentPage = 1;
    limit = 10;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    _datalistService = inject(DatalistService);
    _userService = inject(UserService);

    rows: any[] = [];
    columns = [
        { name: 'ID', prop: 'id' },
        { name: 'Create', prop: 'create', cellClass: 'whitespace-nowrap' },
        { name: 'RW', prop: 'rw_volt' },
        { name: 'YW', prop: 'yw_volt' },
        { name: 'BW', prop: 'bw_volt' },
        { name: 'RY', prop: 'ry_volt' },
        { name: 'YB', prop: 'yb_volt' },
        { name: 'BR', prop: 'br_volt' },
        { name: 'R', prop: 'r_ampere' },
        { name: 'Y', prop: 'y_ampere' },
        { name: 'B', prop: 'b_ampere' },
    ];

    constructor(@Inject(DATE_PIPE_TOKEN) private pipeDateInstance: DatePipe) {}

    ngOnInit(): void {
        this.loadData();
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });
    }
    range(start: number, end: number): number[] {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    loadData(page: number = 1, limit: number = 10): void {
        this._datalistService
            .getData(page, limit)
            .subscribe((response: any) => {
                this.rows = response.data;
                this.totalItems = response.meta.total;
                console.log(this.rows);
            });
    }

    onPage(event: any): void {
        this.currentPage = event.offset + 1;
        this.loadData();
    }
}
