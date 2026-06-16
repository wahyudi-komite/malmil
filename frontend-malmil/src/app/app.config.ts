import { DatePipe, isPlatformBrowser, registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localeId from '@angular/common/locales/id';
import {
    APP_INITIALIZER,
    ApplicationConfig,
    LOCALE_ID,
    PLATFORM_ID,
    inject,
} from '@angular/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
    PreloadAllModules,
    provideRouter,
    withInMemoryScrolling,
    withPreloading,
} from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideFuse } from '@fuse';
import { TranslocoService, provideTransloco } from '@jsverse/transloco';
import { appRoutes } from 'app/app.routes';
import { environment } from '../environments/environment';
import { provideAuth } from 'app/core/auth/auth.provider';
import { provideIcons } from 'app/core/icons/icons.provider';
import { mockApiServices } from 'app/mock-api';
import { firstValueFrom, catchError, of } from 'rxjs';
import { TranslocoHttpLoader } from './core/transloco/transloco.http-loader';
import { DATE_PIPE_TOKEN } from './tokens/date-pipe.token';
registerLocaleData(localeId, 'id-ID');

export const appConfig: ApplicationConfig = {
    providers: [
        provideClientHydration(),
        provideAnimations(),
        provideHttpClient(),
        provideRouter(
            appRoutes,
            withPreloading(PreloadAllModules),
            withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
        ),

        // Material Date Adapter
        {
            provide: DateAdapter,
            useClass: LuxonDateAdapter,
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: {
                    dateInput: 'dd-MM-yyyy',
                },
                display: {
                    dateInput: 'dd-MM-yyyy',
                    monthYearLabel: 'LLL yyyy',
                    dateA11yLabel: 'dd-MM-yyyy',
                    monthYearA11yLabel: 'LLLL yyyy',
                },
            },
        },

        // Transloco Config
        provideTransloco({
            config: {
                availableLangs: [
                    {
                        id: 'en',
                        label: 'English',
                    },
                    {
                        id: 'tr',
                        label: 'Turkish',
                    },
                ],
                defaultLang: 'en',
                fallbackLang: 'en',
                reRenderOnLangChange: true,
                prodMode: true,
            },
            loader: TranslocoHttpLoader,
        }),
        {
            // Preload the default language before the app starts. If the language file
            // is missing or empty, `firstValueFrom` would throw an `EmptyError`. We guard against
            // that by catching the error and completing with an empty object, ensuring the app
            // bootstrap never hangs.
            provide: APP_INITIALIZER,
            useFactory: () => {
                const translocoService = inject(TranslocoService);
                const defaultLang = translocoService.getDefaultLang();
                translocoService.setActiveLang(defaultLang);
                // Load the language file and swallow any EmptyError
                return () =>
                    firstValueFrom(
                        translocoService.load(defaultLang).pipe(
                            // If the observable completes without emitting, provide a fallback.
                            catchError(() => of({}))
                        )
                    );
            },
            multi: true,
        },

        // Service Worker (PWA) — only in production builds
        ...(environment.production
            ? [provideServiceWorker('ngsw-worker.js', {
                enabled: true,
                registrationStrategy: 'registerWhenStable:5000',
            })]
            : []),

        // Fuse
        provideAuth(),
        provideIcons(),
        provideFuse({
            mockApi: {
                delay: 0,
                services: mockApiServices,
            },
            fuse: {
                layout: 'classy',
                scheme: 'light',
                screens: {
                    sm: '600px',
                    md: '960px',
                    lg: '1280px',
                    xl: '1440px',
                },
                theme: 'theme-brand',
                themes: [
                    {
                        id: 'theme-default',
                        name: 'Default',
                    },
                    {
                        id: 'theme-brand',
                        name: 'Brand',
                    },
                    {
                        id: 'theme-teal',
                        name: 'Teal',
                    },
                    {
                        id: 'theme-rose',
                        name: 'Rose',
                    },
                    {
                        id: 'theme-purple',
                        name: 'Purple',
                    },
                    {
                        id: 'theme-amber',
                        name: 'Amber',
                    },
                ],
            },
        }),
        {
            provide: DATE_PIPE_TOKEN,
            useValue: new DatePipe('id-ID'),
        },
        { provide: LOCALE_ID, useValue: 'id-ID' },
    ],
};
