import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { GlobalVariable } from '../../../../class/global-variable';
import { PaginateTakeComponent } from '../../../../common/paginate-take/paginate-take.component';
import { PaginateComponent } from '../../../../common/paginate/paginate.component';
import { UserService } from '../../../../core/user/user.service';
import { User } from '../../../../core/user/user.types';
import { Datalist } from '../../../../interface/datalist';
import { Paginate } from '../../../../interface/paginate';
import { DatalistService } from '../../../../services/datalist.service';

@Component({
    selector: 'app-query',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatSortModule,
        PaginateComponent,
        PaginateTakeComponent,
    ],
    templateUrl: './query.component.html',
    styleUrls: ['./query.component.scss'],
    providers: [DatePipe],
})
export class QueryComponent implements OnInit {
    user: User;

    datas: Datalist[] = [];
    total!: number;
    page!: number;
    pageSize!: number;
    last_page!: number;
    find: string = '';
    limit: number = GlobalVariable.pageTake;
    tblName: string = 'm_data15m';

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild(MatSort, { static: true }) sort!: MatSort;

    _datalistService = inject(DatalistService);
    _userService = inject(UserService);

    columnTitles = [
        // {
        //     title: '#',
        //     field: '',
        //     class: '',
        // },
        {
            title: '-',
            field: '',
            class: '',
        },
        {
            title: 'CREATE',
            field: 'create',
            class: 'whitespace-nowrap',
        },
        {
            title: 'Time Job',
            field: 'timejob',
            class: 'whitespace-nowrap',
        },
        {
            title: 'RW',
            field: 'rw_volt',
            class: 'whitespace-nowrap',
        },
        {
            title: 'YW',
            field: 'yw_volt',
            class: 'whitespace-nowrap',
        },
        {
            title: 'BW',
            field: 'bw_volt',
            class: 'whitespace-nowrap',
        },
        {
            title: 'RY',
            field: 'ry_volt',
            class: 'whitespace-nowrap',
        },
        {
            title: 'YB',
            field: 'yb_volt',
            class: 'whitespace-nowrap',
        },
        {
            title: 'BR',
            field: 'br_volt',
            class: 'whitespace-nowrap',
        },
        {
            title: 'R',
            field: 'r_ampere',
            class: 'whitespace-nowrap',
        },
        {
            title: 'Y',
            field: 'y_ampere',
            class: 'whitespace-nowrap',
        },
        {
            title: 'B',
            field: 'b_ampere',
            class: 'whitespace-nowrap',
        },
        {
            title: 'W',
            field: 'w_ampere',
            class: 'whitespace-nowrap',
        },
        {
            title: 'POWER RECEIVE',
            field: 'wh_powerrecv',
            class: '',
        },
        {
            title: 'ACTIVE POWER',
            field: 'active_power',
            class: '',
        },
        {
            title: 'APPARENT',
            field: 'apparent_power',
            class: '',
        },
        {
            title: 'REACTIVE',
            field: 'reactive_power',
            class: '',
        },
        {
            title: 'POWER FACTOR',
            field: 'power_factor',
            class: '',
        },
        {
            title: 'FREQ',
            field: 'freq',
            class: '',
        },
        {
            title: 'TEMP 1',
            field: 'hd1_temp',
            class: '',
        },
        {
            title: 'HUM 1',
            field: 'hd1_hum',
            class: '',
        },
        {
            title: 'TEMP 2',
            field: 'hd2_temp',
            class: '',
        },
        {
            title: 'HUM 2',
            field: 'hd2_hum',
            class: '',
        },
        {
            title: 'TEMP 3',
            field: 'hd3_temp',
            class: '',
        },
        {
            title: 'HUM 3',
            field: 'hd3_hum',
            class: '',
        },
        {
            title: 'LINE RUN',
            field: 'line_run',
            class: '',
        },
        {
            title: 'PLAN',
            field: 'plan_prod',
            class: '',
        },
        {
            title: 'TARGET PROD',
            field: 'target_prod',
            class: '',
        },
        {
            title: 'ACTUAL PROD',
            field: 'act_prod',
            class: '',
        },
    ];
    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });

        this.load();
    }

    load(
        page: number = 1,
        limit: number = 10
        // start = this.start,
        // end = this.end
    ): void {
        this._datalistService
            .all(
                page,
                this.limit,
                this.sort.active,
                this.sort.direction,
                this.find
                // start,
                // end
            )
            .subscribe((res: Paginate) => {
                this.datas = res.data;
                this.total = res.meta.total;
                this.page = res.meta.page;
                this.pageSize = res.meta.pageSize;
                this.last_page = res.meta.last_page;
            });
    }

    sortData(sort: Sort) {
        console.log(sort);

        this.load();
    }

    applyFilter(event: Event) {
        this.find = (event.target as HTMLInputElement).value;
        this.load();
    }

    changeLimit(limit: number): void {
        this.limit = limit;
        this.load();
    }

    exportexcel() {}
}
