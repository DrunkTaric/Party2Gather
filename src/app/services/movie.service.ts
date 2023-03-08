import { Injectable } from '@angular/core';
import { search, info } from '../classes/imdb/main';
import bInfo from '../classes/imdb/interfaces/Binfo';
import dInfo from '../classes/imdb/interfaces/Dinfo';


@Injectable()
export class MovieService {
  async look_for_results(querry: string): Promise<any> | null {
    let respond: any  = await search(querry)
    if (respond) {
      let _export: dInfo[] = [];
      for (let i = 0; i < respond.results.length; i++) {
        let curr_item: bInfo = respond.results[i]
        if (curr_item.type == "movie") {
          let movie_id: string = curr_item.id
          let data = await info(movie_id)
          _export.push(data)
        }
      }
      return _export;
    }else {
      return null;
    }
  }
}