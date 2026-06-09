import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { Observable, catchError, throwError, switchMap } from 'rxjs';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);

    // Clone the request object
    let newReq = req.clone({ withCredentials: true });

    // Request
    //
    // If the access token didn't expire, add the Authorization header.
    // We won't add the Authorization header if the access token expired.
    // This will force the server to return a "401 Unauthorized" response
    // for the protected API routes which our response interceptor will
    // catch and delete the access token from the local storage while logging
    // the user out from the app.
    // Helper to read cookie
    const getCookie = (name: string): string | null => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    };

    const xsrfToken = getCookie('XSRF-TOKEN');

    if (
        authService.accessToken &&
        !AuthUtils.isTokenExpired(authService.accessToken)
    ) {
        if (xsrfToken) {
            newReq = req.clone({
                withCredentials: true,
                setHeaders: {
                    Authorization: `Bearer ${authService.accessToken}`,
                    'x-xsrf-token': xsrfToken,
                },
            });
        } else {
            newReq = req.clone({
                withCredentials: true,
                setHeaders: {
                    Authorization: `Bearer ${authService.accessToken}`,
                },
            });
        }
    }

    return next(newReq).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                // Attempt token refresh
                return authService.refreshToken().pipe(
                    switchMap((resp: any) => {
                        if (resp && resp.accessToken) {
                            // Update access token and retry original request
                            authService.accessToken = resp.accessToken;
                            const retryReq = req.clone({ withCredentials: true });
                            return next(retryReq);
                        }
                        // Refresh failed, sign out
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
