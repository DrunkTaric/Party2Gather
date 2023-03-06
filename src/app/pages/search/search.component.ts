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
    if (!(querry == "" || querry == " ")) {
      let response: any | null = await this.service.look_for_results(querry);
      if (response != null) {
        console.log(response)
      }else {
        this.router.navigate(['/error'])
      }
    }
  }
}