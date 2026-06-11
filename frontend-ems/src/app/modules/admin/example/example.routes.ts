import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardService } from './dashboard/dashboard.service';
import { QueryComponent } from './query/query.component';


export default [
    {
        path: 'example',
        component: ExampleComponent,
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        resolve: {
            data: () => inject(DashboardService).getData(),
        },
    },
    // {
    //     path: 'example',
    //     component: ExampleComponent,
    // },

    {
        path: 'query',
        component: QueryComponent,
    },
] as Routes;
