import bInfo from '../classes/imdb/interfaces/Binfo';
import dInfo from '../classes/imdb/interfaces/Dinfo';
import { search } from '../classes/imdb/search';
import { cache } from '../classes/cache/main';
import { info } from '../classes/imdb/info';
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

@Injectable()
export class MovieService {

  constructor(private router: Router) {}

  async search_for_results(results: bInfo[], cacher: cache) {
    let _export: dInfo[] = [];
    let promises: Promise<unknown>[] = []
    for (let i = 0; i < results.length; i++) {
      let curr_item: bInfo = results[i]
      let movie_id: string = curr_item.id
      promises.push(new Promise(reslove => info(movie_id, function(data) {
        reslove(data)
      })))
    }
    Promise.allSettled(promises).then((values: any) => values.forEach(value => {
      _export.push(value.value)
    })).finally(() => {
      this.router.navigate(['/selector', {data: JSON.stringify(_export)}])
      cacher.write(_export)
    });
  }

  async look_for_results(querry: string): Promise<any> | null {
    let respond: any  = await search(querry)
    if (!respond) {this.router.navigate(['/error']); return}
    respond.results = respond.results.filter(e => e.type == "movie")
    let cacher = new cache(querry.toLowerCase(), respond.results.length)
    let checker = await cacher.check()
    console.log(checker)
    if (typeof checker != "boolean") {
      setTimeout(() => {
        this.router.navigate(['/selector', {data: JSON.stringify(checker)}]); 
      }, 500);
      return
    };
    await this.search_for_results(respond.results, cacher)
  }
}