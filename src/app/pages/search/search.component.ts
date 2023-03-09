import { Router } from "@angular/router";
import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

@Injectable()
export class SearchComponent {
  constructor (private router: Router, private service: MovieService) {};

  async search(querry: string) {
    this.router.navigate(['/load'])
    await this.service.look_for_results(querry);
  }
}