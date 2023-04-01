import TorrentSearchApi from "torrent-search-api"
import TorrentStream from "torrent-stream"
import express from "express"
import yts from "yts"

const app = express()

/*
const NUMBERS = "123456789"
const GREEK = "i ii iii iv v vi vii viii ix"

async function pharseSearch(query: string, year: string): Promise<TorrentSearchApi.Torrent[]> {  
  let original_query = query
  let cached_query = original_query
  for (let i = 0; i < NUMBERS.length; i++) {
    cached_query = cached_query.replace(NUMBERS[i], "")
  }
  TorrentSearchApi.enablePublicProviders()
  let cached_results;
  let results: TorrentSearchApi.Torrent[] = await TorrentSearchApi.search(original_query, "Movies", 30)
  cached_results = results.filter(e => e.title.toLowerCase().includes(cached_query.toLowerCase()))
  if (cached_results.length > 0) {
    results = cached_results
  }
  cached_results =  results.filter(e => ["1080", "720"].some(element => e.title.includes(element)))
  if (cached_results.length > 0) {
    results = cached_results
  }
  cached_results =  results.filter(e => e.title.includes(year))
  if (cached_results.length > 0) {
    results = cached_results
  }
  return results
}

interface TorrentData {
  title: string;
  time: string;
  size: string;
  magnet_url?: string;
  desc: string;
  provider: string;
}

app.get('/search/:query/:year', async function (req, res) {
  if (req.params.query) {
    let _export: any = [];
    let Promises: Promise<unknown>[] = []
    let results: TorrentData[] | any = await pharseSearch(req.params.query, req.params.year)
    for (let i = 0; i < results.length; i++) {
      Promises.push(new Promise(async reslove => reslove([await TorrentSearchApi.getMagnet(results[i]), i])))
    }
    Promise.allSettled(Promises).then((values: any) => values.forEach(element => {
      _export.push(element.value);
    })).finally(() => {
      for (let i = 0; i < _export.length; i++) {
        results[_export[i][1]].magnet_url =  _export[i][0]
      }
      res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
      res.send(results)
      res.end()
    })
  }
})*/


app.get('/search/:query', async function (req, res) {
  if (req.params.query) {
    let search_results = await yts.listMovies({ limit: 1, query_term: req.params.query });
    let movie_results = await yts.movieDetails({movie_id: search_results.movies[0].id});
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:4200");
    res.send(movie_results.torrents)
  }
})

app.get('/get/:link', async function (req, res) {
  req.setTimeout(60*60*24)
  if (req.params.link) {
    let data = TorrentStream(`magnet:?${req.params.link}`, {
      connections: 300
    })
    data.on("ready", async () => {
      console.log("He made A request")
      data.files.forEach(async file => {
        if (["mp4", "mkv", "webm"].some(element => file.name.toLowerCase().includes(element))) {
          let range: any = []
          range.start = Number((req.headers.range??"0-").replace(/\D/g, ""))
          range.end = Math.min(range.start + 5e7, file.length - 1)
          console.log(range.start)
          res.setHeader('Accept-Ranges', 'bytes')
          res.setHeader('transferMode.dlna.org', 'Streaming')
          res.setHeader('contentFeatures.dlna.org', 'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=017000 00000000000000000000000000')
          if (!range) {
              res.setHeader('Content-Length', file.length)
              if (req.method === 'HEAD') return res.end()
              let cfile = file.createReadStream()
              cfile.pipe(res)
              return
          }
          res.statusCode = 206
          res.setHeader('Content-Length', range.end - range.start + 1)
          res.setHeader('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + file.length)
          res.setHeader('transferMode.dlna.org', 'Streaming')
          res.setHeader('contentFeatures.dlna.org', 'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=017000 00000000000000000000000000')
          if (req.method === 'HEAD') return res.end()
          let cfile = file.createReadStream(range)
          cfile.pipe(res)
        }
      })
    })
  }
})

app.listen(7878, "localhost", function() {
  console.log("Server is ready")
})