import Plyr from 'plyr';
import { Router } from "@angular/router";
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
  public results: any
  public player: Plyr

  constructor(private route: ActivatedRoute, private router: Router) {
    //this.link = `https://www.2embed.to/embed/imdb/movie?id=${this.route.snapshot.paramMap.get("id")}`
    this.results = JSON.parse(this.route.snapshot.paramMap.get("data"))
    console.log(this.results)
    if (!this.results[0].active) {
      this.addActive()
    }
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    //this.safe = this.sanitizer.bypassSecurityTrustResourceUrl(this.link)
    this.player = new Plyr('#plyrID', {});
  }

  addActive() {
    for (let i = 0; i < this.results.length; i++) {
      this.results[i].active = false
      this.results[i].magnet_url = `http://localhost:7878/get/${this.results[i].magnet_url.replace("magnet:?", "")}`
    }
    this.results[0].active = true
  }

  clearActive() {
    for (let i = 0; i < this.results.length; i++) {
      this.results[i].active = false
    }
  }

  getActiveMagnet() {
    for (let i = 0; this.results.length; i++) {
      let item = this.results[i]
      if (item.active == true) {
        return item.magnet_url
      }
    }
  }

  selectServer(id: number) {
    console.log(id)
    this.clearActive()
    this.results[id].active = true
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(["/party", {data: JSON.stringify(this.results)}])
  }
}
