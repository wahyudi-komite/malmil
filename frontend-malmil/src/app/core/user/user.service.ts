import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { map, Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    private _httpClient = inject(HttpClient);
    private _user: ReplaySubject<User | null> = new ReplaySubject<User | null>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User | null) {
        this._user.next(value);
    }

    get user$(): Observable<User | null> {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current signed-in user data
     */
    get(): Observable<User> {
        return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return this._httpClient.patch<User>('api/common/user', { user }).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }

    hasPermission(permission: string): boolean {
        let user: User | null = null;
        this._user.subscribe((u) => (user = u)).unsubscribe();
        return user?.permissions?.includes(permission) ?? false;
    }

    hasRole(...roles: string[]): boolean {
        let user: User | null = null;
        this._user.subscribe((u) => (user = u)).unsubscribe();
        return user?.role ? roles.includes(user.role) : false;
    }
}
