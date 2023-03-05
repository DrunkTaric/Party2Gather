import {Router} from "@angular/router";
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private router: Router, private title : Title) {
    this.title.setTitle('Home')
  }
  goToSearch() {
    this.router.navigate(['/load'])
    setTimeout(() => {
      this.router.navigate(['/search'])
    }, 2000);
  }
}