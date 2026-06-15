import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
// import { User } from '../../../../core/user/user.types';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../../core/user/user.service';
import { DatalistService } from '../../../../services/datalist.service';

interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}

@Component({
    selector: 'app-test',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './test.component.html',
    styleUrl: './test.component.scss',
    providers: [DatePipe],
})
export class TestComponent implements OnInit {
    user: User;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    _datalistService = inject(DatalistService);
    _userService = inject(UserService);

    ngOnInit(): void {
        // this._userService.user$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((user: User) => {
        //         this.user = user;
        //     });
    }
}
