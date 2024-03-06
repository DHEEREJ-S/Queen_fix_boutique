import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  constructor(private app:AppComponent){}
  
admin(){
  this.app.use_status();
}
}
