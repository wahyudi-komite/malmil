import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { Subject, takeUntil } from 'rxjs';
import { GlobalVariable } from '../../../../class/global-variable';
import { DateTimePickerComponentComponent } from '../../../../common/date-time-picker-component/date-time-picker-component.component';
import { PaginateTakeComponent } from '../../../../common/paginate-take/paginate-take.component';
import { PaginateComponent } from '../../../../common/paginate/paginate.component';
import { UserService } from '../../../../core/user/user.service';
import { User } from '../../../../core/user/user.types';
import { Datalist } from '../../../../interface/datalist';
import { Paginate } from '../../../../interface/paginate';
import { DatalistService } from '../../../../services/datalist.service';
import { COLUMN_TITLES } from './query-column-title';

const EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

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
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        DateTimePickerComponentComponent,
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

        this.form = this.fb.group({
            // eg: [''],
            // uniq: [''],
            // start: [this.tanggalMulai],
            // end: [this.tanggalEnd],
        });
        this.load();
    }

    load(page: number = 1, limit: number = 10): void {
        this._datalistService
            .all(
                page,
                this.limit,
                this.sort.active,
                this.sort.direction,
                this.find
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

    applyFilter(event: Event) {
        this.find = (event.target as HTMLInputElement).value;
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
        // this.start = this.form.value.start;
        // this.end = this.form.value.end;
        // this.eg = this.form.value.eg;
        // this.uniq = this.form.value.uniq;
        this.load();
    }
}
