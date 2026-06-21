import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { RoleGuard } from 'app/core/auth/guards/role.guard';
import { LayoutComponent } from 'app/layout/layout.component';

export const appRoutes: Route[] = [
    // Post-Google-OAuth redirect (no guard — auth cookies already set by backend)
    {
        path: 'signed-in-redirect',
        component: LayoutComponent,
        data: { layout: 'empty' },
        children: [
            { path: '', loadChildren: () => import('app/modules/auth/signed-in-redirect/signed-in-redirect.routes') },
        ],
    },

    // Storefront — public
    {
        path: '',
        component: LayoutComponent,
        data: { layout: 'storefront' },
        children: [
            { path: '', loadChildren: () => import('app/modules/storefront/landing/landing.routes') },
            { path: 'catalog', loadChildren: () => import('app/modules/storefront/catalog/catalog.routes') },
            { path: 'product/:slug', loadChildren: () => import('app/modules/storefront/product-detail/product-detail.routes') },
            { path: 'cart', loadChildren: () => import('app/modules/storefront/cart-page/cart-page.routes') },
            { path: 'checkout', loadChildren: () => import('app/modules/storefront/checkout/checkout.routes') },
            { path: 'payment-status/:orderNumber', loadChildren: () => import('app/modules/storefront/payment-status/payment-status.routes') },
            { path: 'order/:orderNumber', loadChildren: () => import('app/modules/storefront/order-tracking/order-tracking.routes') },
            {
                path: 'account',
                canActivate: [AuthGuard],
                loadChildren: () => import('app/modules/storefront/customer-dashboard/customer-dashboard.routes'),
            },
        ],
    },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        component: LayoutComponent,
        data: { layout: 'empty' },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes') },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes') },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes') },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes') },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        component: LayoutComponent,
        data: { layout: 'empty' },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes') },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes') },
        ],
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard, RoleGuard],
        component: LayoutComponent,
        data: {
            layout: 'classy',
            roles: ['super_admin', 'admin', 'operator'],
        },
        resolve: { initialData: initialDataResolver },
        children: [
            { path: 'dashboard', loadChildren: () => import('app/modules/admin/dashboard/dashboard.routes') },
            { path: 'audit-log', loadChildren: () => import('app/modules/admin/audit-log/audit-log.routes') },
            { path: 'products', loadChildren: () => import('app/modules/admin/products/products.routes') },
            { path: 'orders', loadChildren: () => import('app/modules/admin/orders/orders.routes') },
            { path: 'coupons', loadChildren: () => import('app/modules/admin/coupons/coupons.routes') },
            { path: 'users', loadChildren: () => import('app/modules/admin/users/users.routes') },
            { path: 'inventory', loadChildren: () => import('app/modules/admin/inventory/inventory.routes') },
            { path: 'audit-logs', loadChildren: () => import('app/modules/admin/audit-logs/audit-logs.routes') },
            { path: 'banners', loadChildren: () => import('app/modules/admin/banners/banners.routes') },
            { path: 'settings', loadChildren: () => import('app/modules/admin/settings/settings.routes') },
            { path: 'roles', loadChildren: () => import('app/modules/admin/roles/roles.routes') },
            { path: 'categories', loadChildren: () => import('app/modules/admin/categories/categories.routes') },
        ],
    },
];
