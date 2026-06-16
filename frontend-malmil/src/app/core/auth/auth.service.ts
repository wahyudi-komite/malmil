import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import {
    catchError,
    map,
    Observable,
    of,
    switchMap,
    tap,
    throwError,
} from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);

    refreshToken(): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/auth/refresh`, {});
    }

    checkAuthStatus(): Observable<boolean> {
        return this._httpClient
            .get<{
                isAuthenticated: boolean;
            }>(`${environment.apiUrl}/auth/check-auth`)
            .pipe(
                map((response: any) => {
                    this._authenticated = response.isAuthenticated;
                    if (response.user) {
                        this._userService.user = this._mapUser(response.user);
                    }
                    return response.isAuthenticated;
                }),
                catchError(() => of(false))
            );
    }

    private _mapUser(user: any): any {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role?.name,
            permissions: user.role?.permissions?.map((p: any) => p.name) ?? [],
        };
    }

    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/auth/forgot-password`, { email });
    }

    resetPassword(password: string, token: string): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/auth/reset-password`, { password, token });
    }

    signIn(credentials: { email: string; password: string }): Observable<any> {
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient
            .post(`${environment.apiUrl}/auth/sign-in`, credentials)
            .pipe(
                tap((response: any) => {
                    this._authenticated = true;
                    if (response.user) {
                        this._userService.user = this._mapUser(response.user);
                    }
                })
            );
    }

    signInUsingToken(): Observable<any> {
        return this._httpClient
            .post(`${environment.apiUrl}/auth/sign-in-with-token`, {})
            .pipe(
                tap((response: any) => {
                    this._authenticated = true;
                    if (response.user) {
                        this._userService.user = this._mapUser(response.user);
                    }
                }),
                catchError(() => of(false))
            );
    }

    signOut(): Observable<any> {
        return this._httpClient
            .post(`${environment.apiUrl}/auth/logout`, {})
            .pipe(
                tap({
                    next: () => {
                        this._authenticated = false;
                        this._userService.user = null;
                    },
                    error: () => {
                        this._authenticated = false;
                        this._userService.user = null;
                    },
                }),
                switchMap(() => of(true)),
                catchError(() => of(true))
            );
    }

    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/auth/sign-up`, user);
    }

    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post(`${environment.apiUrl}/auth/unlock-session`, credentials);
    }

    check(): Observable<boolean> {
        return this.checkAuthStatus().pipe(
            switchMap((isAuthenticated) => {
                if (isAuthenticated) {
                    return of(true);
                }
                return this.refreshToken().pipe(
                    switchMap(() => this.checkAuthStatus()),
                    catchError(() => of(false))
                );
            })
        );
    }
}
