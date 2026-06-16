import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { catchError, of, switchMap, timeout } from 'rxjs';

export const NoAuthGuard: CanActivateFn | CanActivateChildFn = (
    route,
    state
) => {
    const router: Router = inject(Router);

    return inject(AuthService).checkAuthStatus().pipe(
        timeout(3000),
        switchMap((authenticated) => {
            if (authenticated) {
                return of(router.parseUrl(''));
            }
            return of(true);
        }),
        catchError(() => of(true))
    );
};
