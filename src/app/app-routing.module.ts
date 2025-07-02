import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstFormComponent } from './first-form/first-form.component';
import { HomeComponent } from './home/home.component';
import { PatientsComponent } from './patients/patients.component';
import { AboutComponent } from './about/about.component';
import { HomeComponents } from './job/home/home.component';
const routes: Routes = [
  { path: '', component: HomeComponents },
    { path: 'home', component: HomeComponent },
    { path: 'first-form', component: FirstFormComponent },
    {path:'about',component:AboutComponent},
  {path:'paitents',component:PatientsComponent}
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
