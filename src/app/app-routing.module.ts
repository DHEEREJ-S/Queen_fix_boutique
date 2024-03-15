import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ServiceComponent } from './service/service.component';
import { BlouseComponent } from './blouse/blouse.component';
import { OrderComponent } from './order/order.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { DataService } from './firebase/service/data.service';
import { LehengaComponent } from './lehenga/lehenga.component';
import { TopComponent } from './top/top.component';
import { SkirtComponent } from './skirt/skirt.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'service',component:ServiceComponent},
  // {path:'gallery',component:GalleryComponent},
  {path:'service/lehenga',component:LehengaComponent},
  {path:'service/top',component:TopComponent},
  {path:'service/skirt',component:SkirtComponent},
  {path:'aboutus',component:AboutusComponent},
  {path:'service/blouse',component:BlouseComponent},
  {path:'contact',component:ContactComponent},
  {path:'order',component:OrderComponent},
  {path:'admin-login',component:AdminLoginComponent},
  {path:'admin-panel',component:AdminPanelComponent, canActivate:[DataService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled',})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
