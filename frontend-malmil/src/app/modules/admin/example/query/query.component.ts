import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalVariable } from '../../../../class/global-variable';
import { PaginateTakeComponent } from '../../../../common/paginate-take/paginate-take.component';
import { PaginateComponent } from '../../../../common/paginate/paginate.component';
import { UserService } from '../../../../core/user/user.service';
import { User } from '../../../../core/user/user.types';
import { Datalist } from '../../../../interface/datalist';
import { Paginate } from '../../../../interface/paginate';
import { DatalistService } from '../../../../services/datalist.service';
import { COLUMN_TITLES } from './query-column-title';

@Component({
    selector: 'app-query',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatSortModule,
        PaginateComponent,
        PaginateTakeComponent,
        MatInputModule,
        MatDatepickerModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
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

    form: FormGroup;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild(MatSort, { static: true }) sort!: MatSort;

    _datalistService = inject(DatalistService);
    _userService = inject(UserService);
    fb = inject(FormBuilder);

    columnTitles = COLUMN_TITLES;

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });

        const today = new Date();
        this.form = this.fb.group({
            start: [today],
            end: [today],
            rw: [''],
            yw: [''],
            timeJobFrom: [''],
            timeJobTo: [''],
        });
        this.load();
    }

    load(page: number = 1, limit: number = 10): void {
        const raw = this.form.value;
        const filters: Record<string, string> = {};
        if (raw.start) {
            const d = new Date(raw.start);
            filters.start = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        }
        if (raw.end) {
            const d = new Date(raw.end);
            filters.end = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        }
        if (raw.rw) filters.rw = raw.rw;
        if (raw.yw) filters.yw = raw.yw;
        if (raw.timeJobFrom) filters.timeJobFrom = raw.timeJobFrom;
        if (raw.timeJobTo) filters.timeJobTo = raw.timeJobTo;

        this._datalistService
            .all(
                page,
                this.limit,
                this.sort.active,
                this.sort.direction,
                this.find,
                filters
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
        this.load();
    }

    clearFilter() {
        const today = new Date();
        this.form.reset({
            start: today,
            end: today,
            rw: '',
            yw: '',
            timeJobFrom: '',
            timeJobTo: '',
        });
        this.load();
    }

    changeLimit(limit: number): void {
        this.limit = limit;
        this.load();
    }

    exportToExcel(): void {
        this._datalistService.exportExcel(
            this.page,
            this.total,
            this.sort?.active,
            this.sort?.direction,
            this.find
        );
    }

    submit() {
        this.load(1);
    }
}
