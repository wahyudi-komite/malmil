import { Component, OnInit } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../../core/user/user.service';
import { User } from '../../../../core/user/user.types';

@Component({
    selector: 'app-query',
    standalone: true,
    imports: [DataTablesModule],
    templateUrl: './query.component.html',
    styleUrl: './query.component.scss',
})
export class QueryComponent implements OnInit {
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    dtOptions: Config = {};
    constructor(private _userService: UserService) {}

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });

        // const that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            ajax: (dataTablesParameters: any, callback) => {
                this._userService.user$
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((resp) => {
                        console.log(resp);

                        callback({
                            // recordsTotal: resp.recordsTotal,
                            // recordsFiltered: resp.recordsFiltered,
                            // data: resp.data,
                            recordsTotal: 2,
                            recordsFiltered: 2,
                            data: resp,
                        });
                    });
            },
            columns: [
                {
                    title: 'ID',
                    data: 'id',
                },
                {
                    title: 'First name',
                    data: 'name',
                },
                {
                    title: 'Last name',
                    data: 'email',
                },
            ],
        };
    }
}
