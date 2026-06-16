import { Routes } from '@angular/router';
import { AuthSignedInRedirectComponent } from 'app/modules/auth/signed-in-redirect/signed-in-redirect.component';

export default [
    {
        path: '',
        component: AuthSignedInRedirectComponent,
    },
] as Routes;
