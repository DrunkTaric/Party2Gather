
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoadRoutingModule } from './pages/load/load-routing.module';
import { HomeRoutingModule } from './pages/home/home-routing.module';
import { ErrorRoutingModule } from "./pages/error/error-routing.module";
import { SearchRoutingModule } from './pages/search/search-routing.module';
import { SelectorRoutingModule } from './pages/selector/selector-routing.module';
import { PartyRoutingModule } from './pages/party/party-routing.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'load',
    redirectTo: 'load',
    pathMatch: 'full'
  },
  {
    path: 'search',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  {
    path: 'selector',
    redirectTo: 'selector',
    pathMatch: 'full'
  },
  {
    path: 'party',
    redirectTo: 'party',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'error',
    pathMatch: 'full'
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {}),
    HomeRoutingModule,
    ErrorRoutingModule,
    SearchRoutingModule,
    LoadRoutingModule,
    SelectorRoutingModule,
    PartyRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }