import SwiperCore, { SwiperOptions, Autoplay, EffectCoverflow } from 'swiper';
import dInfo from '../../classes/imdb/interfaces/Dinfo';
import { ActivatedRoute, Router } from '@angular/router';
import { API } from '../../classes/imdb/classes/api';
import { Component } from '@angular/core';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})

export class SelectorComponent {
  items: Array<dInfo> = Array.from([])
  api: API = new API()
  config: SwiperOptions = {
    resistance: true,
    resistanceRatio: 0.85,
    allowTouchMove: true,
    simulateTouch:true,
    watchSlidesProgress: true,
    longSwipes: true,
    shortSwipes: true,
    followFinger: true,
    allowSlideNext: true,
    allowSlidePrev: true,
    slidesPerView: 3,
    autoplay: true,
    loop: true,
    effect: "coverflow",
    coverflowEffect: {
      depth: 110,
      rotate: 50,
      scale: 1,
    },
    pagination: { 
      el: '.swiper-pagination', 
      clickable: true 
    },
    spaceBetween: 20
  }; 
  constructor(private route: ActivatedRoute,  private router: Router) {
    this.items = Array.from(JSON.parse(this.route.snapshot.paramMap.get("data")))
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    SwiperCore.use([Autoplay, EffectCoverflow])
  }
  async select(index: number) {
    this.router.navigate(['/load'])
    //let response = await fetch(`http://localhost:7878/search/${this.items[index].title}/${this.items[index].year}`)
    let response = await fetch(`http://localhost:7878/search/${this.items[index].id}`)
    let data = await response.json()
    this.router.navigate(['/party', {data: JSON.stringify(data)}])
  }
}
