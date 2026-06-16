import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'auth-signed-in-redirect',
    template: '',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
})
export class AuthSignedInRedirectComponent implements OnInit {
    constructor(
        private _authService: AuthService,
        private _userService: UserService,
        private _router: Router,
    ) {}

    ngOnInit(): void {
        this._authService.check().subscribe({
            next: (authenticated) => {
                if (!authenticated) {
                    this._router.navigate(['/sign-in']);
                    return;
                }

                this._userService.user$.subscribe((user) => {
                    if (!user) return;
                    if (user.role === 'customer') {
                        this._router.navigate(['/']);
                    } else {
                        this._router.navigate(['/dashboard']);
                    }
                });
            },
            error: () => {
                this._router.navigate(['/sign-in']);
            },
        });
    }
}
