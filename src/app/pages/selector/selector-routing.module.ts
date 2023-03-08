import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SelectorComponent } from './selector.component';

const routes: Routes = [
  {
    path: 'selector',
    component: SelectorComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectorRoutingModule {}
