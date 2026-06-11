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
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
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
            start: [''],
            end: [''],
            rw: [''],
            yw: [''],
            timeJobFrom: [''],
            timeJobTo: [''],
        });
        // Subscribe to filter changes
        this.form.valueChanges
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe(() => {
                this.load();
            });
        this.load();
    }

    load(page: number = 1, limit: number = 10): void {
        const filters = this.form.value;
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

    // Removed applyFilter method; filters now handled via form valueChanges subscription.
    // No longer needed: applyFilter(event: Event) {
    //   this.find = (event.target as HTMLInputElement).value;
    //   this.load();
    // }

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
        // Extract filter values from the form
        const { start, end, rw, yw, timeJobFrom, timeJobTo } = this.form.value;
        // You can customize the service call to include these parameters if supported.
        // For now we simply trigger a reload which will use the generic search (find).
        this.load();
    }
}
