import { Component } from '@angular/core';
import { NgwWowService } from 'ngx-wow';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  ngOnInit(){
    this.user_status=true;
    this.admin_status=false;
  }
  use_status() {
    this.user_status=false;
    this.admin_status=true;
    this.router.navigate(['/admin-login']);
  }
  admin(){
    this.user_status=false;
    this.admin_status=true;
  }
  user(){
    this.user_status=true;
    this.admin_status=false;
  }
  ad_status() {
    this.user_status=true;
    this.admin_status=false;
    this.router.navigate(['']);
  }

user_status: boolean=true; 
admin_status: boolean=false; 

  constructor(private wowService: NgwWowService , private router:Router) {
    this.wowService.init();
  }
}