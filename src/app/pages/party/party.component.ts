import Plyr from 'plyr';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss']
})
export class PartyComponent {
  //link: string
  //safe: SafeResourceUrl
  public active: string
  public results: any
  public player: Plyr

  constructor(private route: ActivatedRoute) {
    //this.link = `https://www.2embed.to/embed/imdb/movie?id=${this.route.snapshot.paramMap.get("id")}`
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    //this.safe = this.sanitizer.bypassSecurityTrustResourceUrl(this.link)
    let local_results = JSON.parse(this.route.snapshot.paramMap.get("data"))
    for (let i = 0; i < local_results.length; i++) {
      local_results[i].active = false
      local_results[i].quality = local_results[i].quality.replace("p", "")
      local_results[i].magnet_url = `http://localhost:7878/get/${local_results[i].magnet_url.replace("magnet:?", "")}`
    }
    local_results[0].active = true
    this.active = local_results[0].magnet_url
    this.results = local_results
    this.player = new Plyr('#plyrID', {});
    this.player.source = local_results[0].magnet_url
    this.player.once("play", function() {})
  }

  getActiveMagnet(item) {
    for (let i = 0; this.results.length; i++) {
      let item = this.results[i]
      if (item.active == true) {
        console.log(item.magnet_url)
        return item.magnet_url
      }
    }
  }
}
