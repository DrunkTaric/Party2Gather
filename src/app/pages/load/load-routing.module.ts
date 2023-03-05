import {Router} from "@angular/router"
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoadComponent } from './load.component';

const routes: Routes = [
  {
    path: 'load',
    component: LoadComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoadRoutingModule {}
