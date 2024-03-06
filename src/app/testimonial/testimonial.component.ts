import { Component } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.css']
})
export class TestimonialComponent {
  title = 'queen_fix';
  customOptions: OwlOptions = {
    margin: 40,
    loop: true,
    autoplay: true,
    center: true,
    dots:false,
    autoplayTimeout: 5000,
    nav:true,
    navText:['<i class="fa-solid fa-caret-left"></i>','<i class="fa-solid fa-caret-right"></i>'],
    autoplayHoverPause: true,
    responsive: {
      0:{
        items:1
      }
    }
}

}
