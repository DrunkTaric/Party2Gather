import { Injectable } from '@angular/core';
import { searchTitleByName , getTitleDetailsByIMDBId , IFoundedTitleDetails , ITitle } from '../classes/movier';

@Injectable()
export class MovieService {
  async look_for_results(querry: string): Promise<ITitle[]> | null {
    let respond: IFoundedTitleDetails[]  = await searchTitleByName(querry)
    if (respond) {
      console.log(respond)
      let _export: ITitle[] = [];
      for (let i = 0; i < respond.length; i++) {
        if (respond[i].titleType == "movie") {
          let movie_id: string = respond[i].source.sourceId
          _export.push(await getTitleDetailsByIMDBId(movie_id))
        }
      }
      return _export;
    }else {
      return null;
    }
  }
}