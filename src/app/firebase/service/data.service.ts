import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from'@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable,map } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  orderdetails!: AngularFirestoreCollection<user_order_details>;
  enquirydetails!: AngularFirestoreCollection<user_enquiry_details>;
  comformdetails!: AngularFirestoreCollection<user_order_details>;
    
userdetails!: AngularFirestoreCollection<user_details>;
user!: Observable<user_details[]>;
userDoc!: AngularFirestoreDocument<user_details>;
ud!:any[];

  u_details(){
    this.afs.collection('user_details').valueChanges().subscribe(
      (data: any[]) => {
        this.ud = data;
        // Perform a for loop or other operations here
        for (let i = 0; i < this.ud.length; i++) {
          console.log(this.ud[i]);
          // Perform any other operations with this.user_details[i]
        }
      },
      error => {
        console.error('Error fetching data from Firestore:', error);
      }
    );
  }
  constructor(public afs:AngularFirestore,private fireauth : AngularFireAuth, private router : Router) {

    // order
    this.orderdetails=this.afs.collection('user_order_details');

    // enquiry
    this.enquirydetails=this.afs.collection('user_enquiry_details');

    // user
    this.userdetails=this.afs.collection('user_details');

    // conform
    this.comformdetails=this.afs.collection('conform_order');

   }
// add enquiry
   add_enquiry_Item(Enquiry: user_enquiry_details) {
    this.enquirydetails.add(Enquiry);
  }

  // add user
  add_user(userD: user_details) {

    this.afs.collection('user_details').valueChanges().subscribe(
      (data: any[]) => {
        this.ud = data;
        // Perform a for loop or other operations here
        let count=0;
        for (let i = 0; i < this.ud.length; i++) {
          if(this.ud[i].phone_number==userD.phone_number){
            count=1;
          }
        }
        if(count!=1){
          this.userdetails.add(userD);
        }
      },
      error => {
        console.error('Error fetching data from Firestore:', error);
      }
    );
  }

  // add order
  add_order_Item(Order: user_order_details) {
    this.orderdetails.add(Order);
  }
// add conform order
add_conform_order(conform:user_order_details){
  this.comformdetails.add(conform);

}
  // login
  
  login(email : string, password : string) {
    this.fireauth.signInWithEmailAndPassword(email,password).then( res => {
        localStorage.setItem('token','true');
        this.admin=true;
        this.router.navigate(['/admin-panel']);
    }, err => {
        alert(err.message);
        this.router.navigate(['/admin-login']);
    })
    this.u_details();
  }
  admin:boolean=false;
  inAdmin(){
    this.admin=true;
  }
  canActivate():boolean{
    if(this.admin==true){return true}
    else{return false}
  }
  // password reset link
  sendlink(email:string){
    this.fireauth.sendPasswordResetEmail(email)
    .then(() => {
      // this.admin_login.backToLogin()
    }, 
    err => {
      alert('Something went wrong');
    })
  }



}

interface user_details{
  id?:string;
  name?:string;
  phone_number?:string;
}

interface user_enquiry_details{
  id?:string;
  name?:string;
  email?:string;
  message?:string;
}

interface user_order_details{
  id?:string;
  name?:string;
  email?:string;
  description?:string;
  call?:string;
  model?:string;
  phone_number?:string;
}