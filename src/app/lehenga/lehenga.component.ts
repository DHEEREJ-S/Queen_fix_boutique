import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-lehenga',
  templateUrl: './lehenga.component.html',
  styleUrls: ['./lehenga.component.css']
})
export class LehengaComponent {
  customOptions: OwlOptions = {
    margin: 40,
    loop: true,
    autoplay: true,
    dots: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    responsive: {
      0:{
        items:2
      },
      600:{
        items:3,
        dotsEach: true
      },
      1000:{
        items:3,
        dotsEach: true
      }
    }
}
}
