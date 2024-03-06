import { Component} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../firebase/service/data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent{
  
  name=new FormControl('', [Validators.required, Validators.nullValidator, Validators.minLength(3)])
  email=new FormControl('',[Validators.required, Validators.nullValidator, Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')])
  msg=new FormControl('', [Validators.required, Validators.nullValidator])
  
  constructor(private toastr: ToastrService, private data:DataService) {}


  Submit() {
    // console.log('valid:', this.name.valid)
    // console.log(this.name.value)
    if(this.name.valid && this.email.valid && this.msg.valid) {
      // window.open("https://wa.me/" +"7339303642"+"?text="+"Name : "+ this.name.value+"%0a"+"Email : "+this.email.value+"%0a"+"  "+this.msg.value,'_blank')?.focus();
      if(this.user_enquiry_details.name!='' && this.user_enquiry_details.email!=''  && this.user_enquiry_details.message!=''){
        this.data.add_enquiry_Item(this.user_enquiry_details);
        this.user_enquiry_details.name='';
        this.user_enquiry_details.email='';
        this.user_enquiry_details.message='';
      }
      this.showSuccess()
    } 
    else{
      this.showError()
    }
  }



  namecheck(){
    if(this.name.touched && this.name.errors?.['required']){
      this.namer()
    }
    if(this.name.touched && this.name.errors?.['minlength']){
      this.namel()
    }
  }

  emailcheck(){
    if(this.email.touched && this.email.errors?.['required']){
      this.emailr()
    }
    if(this.email.touched && this.email.errors?.['pattern']){
      this.emailp()
    }
  }


  msgcheck(){
    if(this.msg.touched && this.msg.errors?.['required']){
      this.msgr()
    }
  }


  showSuccess(){
    this.toastr.success('Successfully Send','Details')
  }
  showError(){
    this.toastr.error('Fill the details properly','Details')
  }
  namer(){
    this.toastr.error('Name is requried','Details')
  }
  namel(){
    this.toastr.error('Minimum 3 Character is Required','Name')
  }
  emailr(){
    this.toastr.error('Email ID is requried','Details')
  }
  emailp(){
    this.toastr.error('Enter Email id properly','Email')
  }
  msgr(){
    this.toastr.error('Message is requried','Details')
  }


  // data shared
  user_enquiry_details:details={
    name:'',
    email:'',
    message:''
  }
}


interface details{
  id?:string;
  name?:string;
  email?:string;
  message?:string;
}