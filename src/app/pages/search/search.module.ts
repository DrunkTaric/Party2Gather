import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';

@NgModule({
  declarations: [
    SearchComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  providers: [
    MovieService
  ]
})

export class SearchModule { }
