import { Injectable } from '@angular/core';
import { search } from '../classes/imdb/search';
import { Router } from "@angular/router";
import { info } from '../classes/imdb/info';
import bInfo from '../classes/imdb/interfaces/Binfo';
import dInfo from '../classes/imdb/interfaces/Dinfo';


@Injectable()
export class MovieService {

  constructor(private router: Router) {}

  async look_for_results(querry: string): Promise<any> | null {
    let respond: any  = await search(querry)
    if (respond) {
      let _export: dInfo[] = [];
      let promises: Promise<unknown>[] = []
      respond.results = respond.results.filter(e => e.type == "movie")
      for (let i = 0; i < respond.results.length; i++) {
        let curr_item: bInfo = respond.results[i]
        let movie_id: string = curr_item.id
        promises.push(new Promise(reslove => info(movie_id, function(data) {
          reslove(data)
        })))
      }
      Promise.allSettled(promises).then((values: any) => values.forEach(value => {
        _export.push(value.value)
      })).finally(() => {
        this.router.navigate(['/selector', {data: JSON.stringify(_export)}])
      });
    }else {
      this.router.navigate(['/error'])
    }
  }
}