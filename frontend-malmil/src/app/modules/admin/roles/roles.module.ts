import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './roles.component';

const routes: Routes = [
  { path: '', component: RolesComponent },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), RolesComponent],
})
export class RolesModule {}
