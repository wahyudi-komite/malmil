import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesListComponent } from './categories-list.component';

const routes: Routes = [
  { path: '', component: CategoriesListComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), CategoriesListComponent]
})
export class CategoriesModule {}
