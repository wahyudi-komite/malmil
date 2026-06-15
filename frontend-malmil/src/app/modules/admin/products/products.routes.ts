import { Routes } from '@angular/router';
import { ProductsListComponent } from './products-list.component';
import { ProductFormComponent } from './product-form.component';

export default [
    { path: '', component: ProductsListComponent },
    { path: 'new', component: ProductFormComponent },
    { path: ':id/edit', component: ProductFormComponent },
] as Routes;
