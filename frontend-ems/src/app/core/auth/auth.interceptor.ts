import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, catchError, throwError, switchMap } from 'rxjs';

const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
};

export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);

    const xsrfToken = getCookie('XSRF-TOKEN');

    let newReq = req.clone({ withCredentials: true });

    if (xsrfToken) {
        newReq = newReq.clone({
            setHeaders: { 'x-xsrf-token': xsrfToken },
        });
    }

    return next(newReq).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                return authService.refreshToken().pipe(
                    switchMap(() => {
                        const retryReq = req.clone({ withCredentials: true });
                        return next(retryReq);
                    }),
                    catchError(() => {
                        authService.signOut();
                        location.reload();
                        return throwError(error);
                    })
                );
            }
            return throwError(error);
        })
    );
};
