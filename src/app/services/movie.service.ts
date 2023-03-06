import { Injectable } from '@angular/core';
import { search, info } from '../classes/imdb/main';

@Injectable()
export class MovieService {
  async look_for_results(querry: string): Promise<any> | null {
    let respond: any  = await search(querry)
    if (respond) {
      console.log(respond)
      let _export: any = [];
      for (let i = 0; i < respond.length; i++) {
        if (respond[i].titleType == "movie") {
          let movie_id: string = respond[i].source.sourceId
          _export.push(await info(movie_id))
        }
      }
      return _export;
    }else {
      return null;
    }
  }
}