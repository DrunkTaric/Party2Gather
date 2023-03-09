import SwiperCore, { SwiperOptions, Autoplay, EffectCoverflow } from 'swiper';
import dInfo from '../../classes/imdb/interfaces/Dinfo';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})

export class SelectorComponent {
  items: Array<dInfo> = Array.from([])
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
  select(index: number) {
    this.router.navigate(['/party', {id: this.items[index].id}])
  }
}
