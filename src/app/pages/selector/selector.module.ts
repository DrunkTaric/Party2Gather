import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectorComponent } from './selector.component';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  declarations: [
    SelectorComponent
  ],
  imports: [
    CommonModule,
    SwiperModule
  ]
})

export class SelectorModule { }
