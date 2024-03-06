import { Component, ElementRef, Renderer2 } from '@angular/core';
import { AppComponent } from '../app.component';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from'@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { DataService } from '../firebase/service/data.service';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import firebase from 'firebase/compat/app';
import "firebase/auth"
import "firebase/firestore"
interface order{
  id:string;
  name:string;
  email:string;
  description:string;
  call:string;
  model:string;
  phone_number:string;
}

interface enquiry{
  id:string;
  name:string;
  email:string;
  message:string;
}

interface user_details{
  id?:string;
  name?:string;
  phone_number?:string;
}

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
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {

  ngOnInit(){
  this.app.admin();
  this.data.inAdmin();
  firebase.initializeApp(firebaseConfig)
  // order details
  this.orderCol = this.afs.collection('user_order_details');
    this.order = this.orderCol.snapshotChanges().pipe(map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as order;
          data.id = a.payload.doc.id;
          return data;
        });
      }));

      // user
      this.userCol = this.afs.collection('user_details');
    this.used = this.userCol.snapshotChanges().pipe(map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as order;
          data.id = a.payload.doc.id;
          return data;
        });
      }));
    
      // conform order details
  this.conformOrdCol = this.afs.collection('conform_order');
  this.conformOrd = this.conformOrdCol.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as order;
        data.id = a.payload.doc.id;
        return data;
      });
    }));

    // enquiry details
    this.enquiryCol = this.afs.collection('user_enquiry_details');
    this.enquiry = this.enquiryCol.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as enquiry;
        data.id = a.payload.doc.id;
        return data;
      });
    }));
 }
 constructor(private toastr: ToastrService,private app:AppComponent,private data:DataService, private afs: AngularFirestore,private renderer: Renderer2, private el: ElementRef){}

// user    ---------------------------------------------------------------------------------------------------
userIf:user_details={
  id:'',
  name:'',
  phone_number:''
}
userCol!: AngularFirestoreCollection<user_details>;
  used!: Observable<user_details[]>;
  userDoc!: AngularFirestoreDocument<user_details>;
// add user
addUser(user:user_details){
  this.data.add_user(user);
}

deleteuser(_event: any, use:user_details){
  this.userDoc=this.afs.doc(`user_details/${use.id}`);
  this.userDoc.delete();
}
// add order   -------------------------------------------------------------------------------------
user_order_details:order={
  name: '',
  email: '',
  description: '',
  call: '',
  model: '',
  phone_number: '',
  id: ''
}

name=new FormControl('', [Validators.required, Validators.nullValidator, Validators.minLength(3)])
email=new FormControl('',[Validators.required, Validators.nullValidator, Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')])
msg=new FormControl('', [Validators.required, Validators.nullValidator])
phno=new FormControl('', [Validators.required, Validators.nullValidator, Validators.minLength(10), Validators.maxLength(10)])
model=new FormControl('', [Validators.required])
call=new FormControl ('', [Validators.required])

Submit() {
  if(this.name.valid && this.email.valid && this.msg.valid && this.model.valid && this.phno.valid && this.call.valid) {
    
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
// user order   --------------------------------------------------------------------------------------------
orderCol!: AngularFirestoreCollection<order>;
order!: Observable<order[]>;
orderDoc!: AngularFirestoreDocument<order>;


// edit order details
edit:boolean=false;
orderToEdit!:order;
editform(_event:any,ord:order){
  this.edit=true;
  this.orderToEdit=ord;
}

closeEditForm(){
  this.edit=false;
}
updateOrder(ord:order){
  this.orderDoc=this.afs.doc(`user_order_details/${ord.id}`);
  this.orderDoc.update(ord);
  this.closeEditForm();
}
deleteorder(_event: any, ord:order){
  this.orderDoc=this.afs.doc(`user_order_details/${ord.id}`);
  this.orderDoc.delete();
}
// order to conform order
conformOrder(_event:any,ord:order){
  this.data.add_conform_order(ord);
  this.orderDoc=this.afs.doc(`user_order_details/${ord.id}`);
  this.orderDoc.delete();
}

// comform order   -------------------------------------------------------------------------------------------

conformOrdCol!: AngularFirestoreCollection<order>;
conformOrd!: Observable<order[]>;
conformOrdDoc!: AngularFirestoreDocument<order>;

sendMsg(_event: any, ord:order){
  window.open("https://wa.me/" +ord.phone_number+"?text="+"Queen Fix Boutique"+"%0a"+"Your order was done, when you come & pick it.",'_blank')?.focus();
}

updateConOrder(ord:order){
  this.conformOrdDoc=this.afs.doc(`conform_order/${ord.id}`);
  this.conformOrdDoc.update(ord);
  this.closeEditForm();
}

deleteConorder(_event: any, ord:order){
  this.conformOrdDoc=this.afs.doc(`conform_order/${ord.id}`);
  this.conformOrdDoc.delete();
}

// enquiry order   -------------------------------------------------------------------------------------------------
enquiryCol!: AngularFirestoreCollection<enquiry>;
enquiry!: Observable<enquiry[]>;
enquiryDoc!: AngularFirestoreDocument<enquiry>;

deleteenquiry(_event: any, enq:enquiry){
  this.enquiryDoc=this.afs.doc(`user_enquiry_details/${enq.id}`);
  this.enquiryDoc.delete();
}

sendEmail(_event: any, enq:enquiry){
  window.open("https://mail.google.com/mail/?view=cm&fs=1&to=" +enq.email+"&su=Get In Touch Queen Fix Boutique&body=Hi "+enq.name+"%0a"+"I am Dheerej, Owner of QueenFix Boutique",'_blank')?.focus();
}

//  side bar design
 etable:boolean=false;
 otable:boolean=false;
 home:boolean=true;
 addOrder:boolean=false;
 conOrder:boolean=false;
 userDetails:boolean=false;
 enq(){
  this.etable=true;
  this.otable=false;
  this.home=false;
  this.addOrder=false;
  this.conOrder=false;
  this.userDetails=false;

  const divElement6 = this.el.nativeElement.querySelector('.userdiv');
  this.renderer.setStyle(divElement6, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement6, 'margin-right', '15px');
  this.renderer.setStyle(divElement6, 'transition', '500ms');

  const divElement1 = this.el.nativeElement.querySelector('.enqdiv');
  this.renderer.setStyle(divElement1, 'border-radius', '30px 0px 0px 30px');
  this.renderer.setStyle(divElement1, 'margin-right', '0');
  this.renderer.setStyle(divElement1, 'transition', '500ms');

  const divElement2 = this.el.nativeElement.querySelector('.orddiv');
  this.renderer.setStyle(divElement2, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement2, 'margin-right', '15px');
  this.renderer.setStyle(divElement2, 'transition', '500ms');

  const divElement3 = this.el.nativeElement.querySelector('.homediv');
  this.renderer.setStyle(divElement3, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement3, 'margin-right', '15px');
  this.renderer.setStyle(divElement3, 'transition', '500ms');

  const divElement4 = this.el.nativeElement.querySelector('.adddiv');
  this.renderer.setStyle(divElement4, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement4, 'margin-right', '15px');
  this.renderer.setStyle(divElement4, 'transition', '500ms');

  const divElement5 = this.el.nativeElement.querySelector('.condiv');
  this.renderer.setStyle(divElement5, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement5, 'margin-right', '15px');
  this.renderer.setStyle(divElement5, 'transition', '500ms');
 }
 ord(){
  this.etable=false;
  this.otable=true;
  this.home=false;
  this.addOrder=false;
  this.conOrder=false;
  this.userDetails=false;

  const divElement6 = this.el.nativeElement.querySelector('.userdiv');
  this.renderer.setStyle(divElement6, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement6, 'margin-right', '15px');
  this.renderer.setStyle(divElement6, 'transition', '500ms');

  const divElement1 = this.el.nativeElement.querySelector('.enqdiv');
  this.renderer.setStyle(divElement1, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement1, 'margin-right', '15px');
  this.renderer.setStyle(divElement1, 'transition', '500ms');

  const divElement2 = this.el.nativeElement.querySelector('.orddiv');
  this.renderer.setStyle(divElement2, 'border-radius', '30px 0px 0px 30px');
  this.renderer.setStyle(divElement2, 'margin-right', '0');
  this.renderer.setStyle(divElement2, 'transition', '500ms');

  const divElement3 = this.el.nativeElement.querySelector('.homediv');
  this.renderer.setStyle(divElement3, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement3, 'margin-right', '15px');
  this.renderer.setStyle(divElement3, 'transition', '500ms');

  const divElement4 = this.el.nativeElement.querySelector('.adddiv');
  this.renderer.setStyle(divElement4, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement4, 'margin-right', '15px');
  this.renderer.setStyle(divElement4, 'transition', '500ms');

  const divElement5 = this.el.nativeElement.querySelector('.condiv');
  this.renderer.setStyle(divElement5, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement5, 'margin-right', '15px');
  this.renderer.setStyle(divElement5, 'transition', '500ms');
 }
 hom(){
  this.etable=false;
  this.otable=false;
  this.home=true;
  this.addOrder=false;
  this.conOrder=false;
  this.userDetails=false;

  const divElement6 = this.el.nativeElement.querySelector('.userdiv');
  this.renderer.setStyle(divElement6, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement6, 'margin-right', '15px');
  this.renderer.setStyle(divElement6, 'transition', '500ms');

  const divElement1 = this.el.nativeElement.querySelector('.enqdiv');
  this.renderer.setStyle(divElement1, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement1, 'margin-right', '15px');
  this.renderer.setStyle(divElement1, 'transition', '500ms');

  const divElement2 = this.el.nativeElement.querySelector('.orddiv');
  this.renderer.setStyle(divElement2, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement2, 'margin-right', '15px');
  this.renderer.setStyle(divElement2, 'transition', '500ms');

  const divElement4 = this.el.nativeElement.querySelector('.adddiv');
  this.renderer.setStyle(divElement4, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement4, 'margin-right', '15px');
  this.renderer.setStyle(divElement4, 'transition', '500ms');

  const divElement5 = this.el.nativeElement.querySelector('.condiv');
  this.renderer.setStyle(divElement5, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement5, 'margin-right', '15px');
  this.renderer.setStyle(divElement5, 'transition', '500ms');

  const divElement3 = this.el.nativeElement.querySelector('.homediv');
  this.renderer.setStyle(divElement3, 'border-radius', '30px 0px 0px 30px');
  this.renderer.setStyle(divElement3, 'margin-right', '0');
  this.renderer.setStyle(divElement3, 'transition', '500ms');
 }
 add(){
  this.etable=false;
  this.otable=false;
  this.home=false;
  this.addOrder=true;
  this.conOrder=false;
  this.userDetails=false;

  const divElement6 = this.el.nativeElement.querySelector('.userdiv');
  this.renderer.setStyle(divElement6, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement6, 'margin-right', '15px');
  this.renderer.setStyle(divElement6, 'transition', '500ms');

  const divElement1 = this.el.nativeElement.querySelector('.enqdiv');
  this.renderer.setStyle(divElement1, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement1, 'margin-right', '15px');
  this.renderer.setStyle(divElement1, 'transition', '500ms');

  const divElement2 = this.el.nativeElement.querySelector('.orddiv');
  this.renderer.setStyle(divElement2, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement2, 'margin-right', '15px');
  this.renderer.setStyle(divElement2, 'transition', '500ms');

  const divElement4 = this.el.nativeElement.querySelector('.homediv');
  this.renderer.setStyle(divElement4, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement4, 'margin-right', '15px');
  this.renderer.setStyle(divElement4, 'transition', '500ms');

  const divElement5 = this.el.nativeElement.querySelector('.condiv');
  this.renderer.setStyle(divElement5, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement5, 'margin-right', '15px');
  this.renderer.setStyle(divElement5, 'transition', '500ms');

  const divElement3 = this.el.nativeElement.querySelector('.adddiv');
  this.renderer.setStyle(divElement3, 'border-radius', '30px 0px 0px 30px');
  this.renderer.setStyle(divElement3, 'margin-right', '0');
  this.renderer.setStyle(divElement3, 'transition', '500ms');
 }
 user(){
  this.etable=false;
  this.otable=false;
  this.home=false;
  this.addOrder=false;
  this.userDetails=true;
  this.conOrder=false;

  const divElement1 = this.el.nativeElement.querySelector('.enqdiv');
  this.renderer.setStyle(divElement1, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement1, 'margin-right', '15px');
  this.renderer.setStyle(divElement1, 'transition', '500ms');

  const divElement2 = this.el.nativeElement.querySelector('.orddiv');
  this.renderer.setStyle(divElement2, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement2, 'margin-right', '15px');
  this.renderer.setStyle(divElement2, 'transition', '500ms');

  const divElement4 = this.el.nativeElement.querySelector('.adddiv');
  this.renderer.setStyle(divElement4, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement4, 'margin-right', '15px');
  this.renderer.setStyle(divElement4, 'transition', '500ms');

  const divElement5 = this.el.nativeElement.querySelector('.homediv');
  this.renderer.setStyle(divElement5, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement5, 'margin-right', '15px');
  this.renderer.setStyle(divElement5, 'transition', '500ms');

  const divElement6 = this.el.nativeElement.querySelector('.condiv');
  this.renderer.setStyle(divElement6, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement6, 'margin-right', '15px');
  this.renderer.setStyle(divElement6, 'transition', '500ms');

  const divElement3 = this.el.nativeElement.querySelector('.userdiv');
  this.renderer.setStyle(divElement3, 'border-radius', '30px 0px 0px 30px');
  this.renderer.setStyle(divElement3, 'margin-right', '0');
  this.renderer.setStyle(divElement3, 'transition', '500ms');
 }
 con(){
  this.etable=false;
  this.otable=false;
  this.home=false;
  this.addOrder=false;
  this.conOrder=true;
  this.userDetails=false;

  const divElement6 = this.el.nativeElement.querySelector('.userdiv');
  this.renderer.setStyle(divElement6, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement6, 'margin-right', '15px');
  this.renderer.setStyle(divElement6, 'transition', '500ms');

  const divElement1 = this.el.nativeElement.querySelector('.enqdiv');
  this.renderer.setStyle(divElement1, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement1, 'margin-right', '15px');
  this.renderer.setStyle(divElement1, 'transition', '500ms');

  const divElement2 = this.el.nativeElement.querySelector('.orddiv');
  this.renderer.setStyle(divElement2, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement2, 'margin-right', '15px');
  this.renderer.setStyle(divElement2, 'transition', '500ms');

  const divElement4 = this.el.nativeElement.querySelector('.adddiv');
  this.renderer.setStyle(divElement4, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement4, 'margin-right', '15px');
  this.renderer.setStyle(divElement4, 'transition', '500ms');

  const divElement5 = this.el.nativeElement.querySelector('.homediv');
  this.renderer.setStyle(divElement5, 'border-radius', '30px 30px 30px 30px');
  this.renderer.setStyle(divElement5, 'margin-right', '15px');
  this.renderer.setStyle(divElement5, 'transition', '500ms');

  const divElement3 = this.el.nativeElement.querySelector('.condiv');
  this.renderer.setStyle(divElement3, 'border-radius', '30px 0px 0px 30px');
  this.renderer.setStyle(divElement3, 'margin-right', '0');
  this.renderer.setStyle(divElement3, 'transition', '500ms');
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

}
