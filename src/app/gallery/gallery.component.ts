import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  customOptions: OwlOptions = {
    margin: 40,
    loop: true,
    autoplay: true,
    dots: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    responsive:{
      0:{
          items:2
      },
      576:{
          items:3,
          dotsEach: true
      },
      992:{
          items:3,
          dotsEach: true
      }
    }
  }
  
}
