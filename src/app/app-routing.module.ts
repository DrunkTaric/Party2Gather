
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeRoutingModule } from './pages/home/home-routing.module';
import { ErrorRoutingModule } from "./pages/error/home-routing.module";
import { SearchRoutingModule } from './pages/search/search-routing.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {}),
    HomeRoutingModule,
    ErrorRoutingModule,
    SearchRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }