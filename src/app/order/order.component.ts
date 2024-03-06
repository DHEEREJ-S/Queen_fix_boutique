import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import firebase from 'firebase/compat/app';
import "firebase/auth"
import "firebase/firestore"
import { DataService } from '../firebase/service/data.service';

var firebaseConfig = {
  apiKey: "AIzaSyB9a9j18m45XyJo41pKJ9TxwjE4luo0Vuo",
  authDomain: "queen-fix-boutique-d05e3.firebaseapp.com",
  projectId: "queen-fix-boutique-d05e3",
  storageBucket: "queen-fix-boutique-d05e3.appspot.com",
  messagingSenderId: "502764262446",
  appId: "1:502764262446:web:2ddb1be8f702080ee2bbbf",
  measurementId: "G-0KVKD9CZT5"
}
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})


export class OrderComponent  implements OnInit{
  name=new FormControl('', [Validators.required, Validators.nullValidator, Validators.minLength(3)])
  email=new FormControl('',[Validators.required, Validators.nullValidator, Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')])
  msg=new FormControl('', [Validators.required, Validators.nullValidator])
  phno=new FormControl('', [Validators.required, Validators.nullValidator, Validators.minLength(10), Validators.maxLength(10)])
  model=new FormControl('', [Validators.required])
  call=new FormControl ('', [Validators.required])
  


  constructor(private toastr: ToastrService,private router:Router, private data:DataService) {}

  ngOnInit(){
    firebase.initializeApp(firebaseConfig)
  }
  
  //order submit
  Submit() {
    if(this.name.valid && this.email.valid && this.msg.valid && this.model.valid && this.phno.valid && this.call.valid) {
      if(this.otpverify==true){
        this.showSuccess()
        this.data.add_order_Item(this.user_order_details);
        this.user_order_details.name='';
        this.user_order_details.email='';
        this.user_order_details.description='';
        this.user_order_details.call='';
        this.user_order_details.model='';
        this.user_order_details.phone_number='';
      }
      else{
        this.verifynumr()
      }
      
    } 
    else{
      this.showError()
    }
  }
//verify number
  //name validation
  namecheck(){
    if(this.name.touched && this.name.errors?.['required']){
      this.namer()
    }
    if(this.name.touched && this.name.errors?.['minlength']){
      this.namel()
    }
  }

  //phone number validation
  phnocheck(){
    if(this.phno.touched && this.name.errors?.['required']){
      this.phnor()
    }
    else if((this.phno.touched) && (this.name.errors?.['minlength'] || this.name.errors?.['maxlength'])){
      this.phnol()
    }
  } 
  num:string="";
  numcheck(event: KeyboardEvent){
    if(event.key.match(/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight/)){}
    else{event.preventDefault();}
  }

  //email validation
  emailcheck(){
    if(this.email.touched && this.email.errors?.['required']){
      this.emailr()
    }
    if(this.email.touched && this.email.errors?.['pattern']){
      this.emailp()
    }
  }

  //msg validation
  msgcheck(){
    if(this.msg.touched && this.msg.errors?.['required']){
      this.msgr()
    }
  }


  //toastr setup
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
  phnor(){
    this.toastr.error('Mobile Number is requried','Details')
  }
  verifynumr(){
    this.toastr.error('Check mobile number is verify or not','Details')
  }
  phnol(){
    this.toastr.error('Mobile Number should be in 10 digits','Mobile Number')
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
  otpr(){
    this.toastr.error('Name & Mobile Number are requried','Details')
  }

// select box
models=[
  {name:'Top'},
  {name:'Lehenga'},
  {name:'Skirt'},
  {name:'Jacket'},
  {name:'Trouser'},
  {name:'Ready To Wear Saree'},
  {name:'Other Type'}
]


// otp

otpstyle={
  allowNumbersOnly:true,
  length:6,
  isPasswordInput:false,
  disableAutoFocus:false,
  placehilder:'',
  inputStyles:{width:'50px', height:'50px'},
}
verify:any;
otp: any;
  reCaptchaVerifier:any;
  submitButton:boolean=true;
  otpvisible:boolean=false;
  otpverify:boolean=false;
  //otp send
  sendotp(){
    if(this.user_order_details.name!="" && this.user_order_details.phone_number!=""){
      this.reCaptchaVerifier=new firebase.auth.RecaptchaVerifier
      ('bot',{size: 'invisible'})
      firebase.auth().signInWithPhoneNumber('+91'+this.user_order_details.phone_number,this.reCaptchaVerifier)
      .then((confirmationResult)=>{
        localStorage.setItem('verificationId',JSON.stringify
        (confirmationResult.verificationId));
        this.otpvisible=true
      })
        .catch((error)=>{
          alert(error.message)
          console.log(this.user_order_details.phone_number)
          setTimeout(()=>{
            window.location.reload();
          },3000);
        })
    }
    else{
      this.otpr();
    }
  }
//user_otp
onOtpChange(otpcode: any) {
  this.otp=otpcode;
  }
  credential:any;
  //otp check
  handleClick(){
    this.verify=JSON.parse(localStorage.getItem('verificationId')|| '{}')
    this.credential=firebase.auth.PhoneAuthProvider.credential( this.verify, this.otp);

    firebase
    .auth()
    .signInWithCredential(this.credential)
    .then((response) => {
      localStorage.setItem('user_data', JSON.stringify(response));
        // this.router.navigate(['/order']);
        // this.order.submit_Button();
        this.otpverify=true
        this.otpvisible=false
        // for(let userD of user){}
        this.data.add_user(this.user_order_details);
        console.log(this.user_order_details.name)
        console.log(this.user_order_details.phone_number)
    })
    .catch((error) => {
      alert(error.message);
      this.otpvisible=false
    });
  }

  user_order_details:details={
    name:'',
    email:'',
    description:'',
    call:'',
    model:'',
    phone_number:'',
  }
}


interface details{
  id?:string;
  name?:string;
  email?:string;
  description?:string;
  call?:string;
  model?:string;
  phone_number?:string;
}
