import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import firebase from 'firebase/compat/app';
import "firebase/auth"
import "firebase/firestore"
import { DataService } from '../firebase/service/data.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

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
  
  amount=0;
  paymentStatus=false;
  transactionId="";
  @ViewChild('paypalRef',{static:true}) paymentRef!:ElementRef;

  constructor(private toastr: ToastrService,private router:Router, private data:DataService) {}

  ngOnInit(){
    firebase.initializeApp(firebaseConfig)

    this.amount=1.21;
    window.paypal.Buttons(
      {style:{
        layout:'horizontal',
        color: 'blue',
        shape:'rect',
        label: 'paypal',
      },createOrder:(data:any,action:any)=>{
        return action.order.create({
          purchase_units:[
            {
              amount:{
                value:this.amount.toString(),
                currency_code:'USD'
              }
            }
          ]
        })
      },
      onApprove:(data:any,action:any)=>{
        return action.order.capture().then((details:any)=>{
          if(details.status==='COMPLETED'){
            this.paymentStatus=true;
            this.transactionId=details.id;
            this.paymentTrue();
          }
        });
      },
      onError:(error:any)=>{
        this.paymentFalse();
      }    
    }
    ).render(this.paymentRef.nativeElement);
  }
  
  //order submit
  Submit() {
    if(this.name.valid && this.email.valid && this.msg.valid && this.model.valid && this.phno.valid && this.call.valid) {
      if(this.otpverify==true && this.paymentStatus==true){
        this.showSuccess()
        this.data.add_order_Item(this.user_order_details);
        this.user_order_details.name='';
        this.user_order_details.email='';
        this.user_order_details.description='';
        this.user_order_details.call='';
        this.user_order_details.model='';
        this.user_order_details.phone_number='';
      }
      else if(this.otpverify==false && this.paymentStatus==false){
        this.verifyBoth()
      }
      else{
        if(this.otpverify==true){
          this.verifyPayment()
        }else{
          this.verifynumr()
        }
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
  showSuccess(){this.toastr.success('Successfully Send','Details')}
  showError(){this.toastr.error('Fill the details properly','Details')}
  namer(){this.toastr.error('Name is requried','Details')}
  namel(){this.toastr.error('Minimum 3 Character is Required','Name')}
  phnor(){this.toastr.error('Mobile Number is requried','Details')}
  verifynumr(){this.toastr.error('Check mobile number is verify or not','Details')}
  phnol(){this.toastr.error('Mobile Number should be in 10 digits','Mobile Number')}
  emailr(){this.toastr.error('Email ID is requried','Details')}
  emailp(){this.toastr.error('Enter Email id properly','Email')}
  msgr(){this.toastr.error('Message is requried','Details')}
  otpr(){this.toastr.error('Name & Mobile Number are requried','Details')}
  paymentTrue(){this.toastr.success('Transaction ID : '+this.transactionId,'Transaction Details :')}
  paymentFalse(){this.toastr.error('Transaction cancel','Transaction Details :')}
  verifyBoth(){this.toastr.error('Verify Phone Number & Pay Advance Payment','Details :')}
  verifyPayment(){this.toastr.error('Pay Advance Payment','Details :')}
  pnVerify(){this.toastr.success('Phone number verify successfully','Details :')}
  

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


// model type
modelShow=false;

modelS(){this.modelShow=true;}
modelSC(){this.modelShow=false;}

// top types
offShoulderTop(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Off Shoulder Top" '}
cropTop(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Crop Top" '}
crossOverTop(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Cross Over Top" '}
ShirtStyleTop(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Shirt Style Top" '}
OneShoulderTop(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"One Shoulder Top" '}
CinchedWaistTop(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Cinched Waist Top" '}
maxiTop(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Maxi Top" '}
KaftanTops(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Kaftan Top" '}

// skirt
ALineSkirt(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"A Line Skirt" '}
AsymmetricSkirt(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Asymmetric Skirt" '}
BellSkirt(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Bell Skirt" '}
BoxPleatSkirt(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Box Pleat Skirt" '}
BubbleSkirt(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Bubble Skirt" '}
MaxiSkirt(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Maxi Skirt" '}
MidiSkirt(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Midi Skirt" '}
MiniSkirt(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Mini Skirt" '}

// lehenga
ALineL(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"A-Line Lehenga" '}
HalfSareeL(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Half Saree Lehenga" '}
MeshL(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Mesh Lehenga" '}
MultiLayersL(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Multi-Layers Lehenga" '}
ShararaL(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Sharara Lehenga" '}
ShortL(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Short Lehenga" '}

// other type
Jacket(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Jacket" '}
RTWS(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Ready To Wear Saree" '}
Churidar(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Churidar" '}
Shirt(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Shirt" '}
Trouser(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Trouser" '}
Salwar(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Salwar" '}
JumpSuit(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Jump Suit" '}
Kurti(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Kurti" '}
Others(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Others" '}

// blouse
PrincessCutBlouse(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Princess Cut Blouse" '}
SleevelessBlouse(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Sleeveless Blouse" '}
DartedBlouse(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Darted Blouse" '}
EmbroideryBlouse(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Pattern Blouse" '}
PatternBlouse(){this.user_order_details.description="";this.user_order_details.description=this.user_order_details.description+'"Pattern Blouse" '}
// carousel
customOptions: OwlOptions = {
  loop: true,
  autoplay: false,
  dots: false,
  center: true,
  autoWidth: true,
  items:3,
  autoplayTimeout: 3000,
  autoplayHoverPause: true,
  responsive:{
    0:{
        items:3
    },
    576:{
        items:3,
    },
    992:{
        items:4,
    }
  }
}

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
        this.pnVerify();
        console.log(this.user_order_details.name)
        console.log(this.user_order_details.phone_number)
    })
    .catch((error) => {
      this.toastr.error(error.message,'Details :')
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
