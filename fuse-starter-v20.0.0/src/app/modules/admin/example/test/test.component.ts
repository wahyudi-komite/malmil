import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../../core/user/user.service';
import { User } from '../../../../core/user/user.types';

@Component({
    selector: 'app-test',
    standalone: true,
    imports: [],
    templateUrl: './test.component.html',
    styleUrl: './test.component.scss',
})
export class TestComponent implements OnInit {
    user: User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _userService: UserService) {}

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });
    }
}
