import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { map, take } from 'rxjs';

export const RoleGuard: CanActivateFn = (route, state) => {
    const router: Router = inject(Router);
    const userService = inject(UserService);

    return userService.user$.pipe(
        take(1),
        map((user) => {
            const allowedRoles = route.data?.['roles'] as string[] | undefined;

            if (!allowedRoles || allowedRoles.length === 0) {
                return true;
            }

            if (user?.role && allowedRoles.includes(user.role)) {
                return true;
            }

            return router.parseUrl('/');
        })
    );
};
