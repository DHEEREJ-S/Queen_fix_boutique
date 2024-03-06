import { Component } from '@angular/core';
import { DataService } from '../firebase/service/data.service';
import { AppComponent } from '../app.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {

  email : string = '';
password : string = '';

constructor(private data : DataService, private app:AppComponent,private toastr: ToastrService) { }

ngOnInit(): void {
  this.app.admin();
}
forgot_password:boolean=false;
login() {
  if(this.email == '') {
    this.showError()
    return;}
  if(this.password == '') {
    this.showError()
    return;}
  this.data.login(this.email,this.password);
  this.email = '';
  this.password = '';
}
forgotpassword(){
  this.forgot_password=!this.forgot_password;
}
backToWeb(){
  this.app.ad_status();
}
emailsend:string='';
sendlink(){
  if(this.emailsend!=''){
    this.data.sendlink(this.emailsend);
    this.emailsend = '';
    this.forgot_password=!this.forgot_password;
  }
  else{
    this.showError();
  }
  
}
backToLogin(){
  this.forgot_password=!this.forgot_password;
}

showError(){
  this.toastr.error('Fill the details properly','Details')
}
}
