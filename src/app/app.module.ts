import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgwWowModule } from 'ngx-wow';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ServiceComponent } from './service/service.component';
import { BlouseComponent } from './blouse/blouse.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { TestimonialComponent } from './testimonial/testimonial.component';
import { FormsModule } from '@angular/forms';
import { OrderComponent } from './order/order.component';
import { DataService } from './firebase/service/data.service';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { Environment } from './firebase/environments/environment';
import { NgOtpInputModule } from  'ng-otp-input';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ServiceComponent,
    GalleryComponent,
    AboutusComponent,
    ContactComponent,
    BlouseComponent,
    NavBarComponent,
    FooterComponent,
    TestimonialComponent,
    OrderComponent,
    AdminLoginComponent,
    AdminPanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    NgwWowModule,
    AngularFireModule.initializeApp(Environment.firebaseConfig),
    AngularFirestoreModule,
    NgOtpInputModule,
    NgSelectModule
  ],
  providers: [DataService,OrderComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
