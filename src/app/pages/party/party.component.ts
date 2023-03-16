import Plyr from 'plyr';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss']
})
export class PartyComponent {
  //link: string
  //safe: SafeResourceUrl
  public player: Plyr

  constructor() {
    //this.link = `https://www.2embed.to/embed/imdb/movie?id=${this.route.snapshot.paramMap.get("id")}`
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    //this.safe = this.sanitizer.bypassSecurityTrustResourceUrl(this.link)
    this.player = new Plyr('#plyrID', {});
    this.player.once("play", function() {})
  }
}
