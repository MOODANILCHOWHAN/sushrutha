import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstFormComponent } from './first-form/first-form.component';
import { HomeComponent } from './home/home.component';
import { PatientsComponent } from './patients/patients.component';
import { AboutComponent } from './about/about.component';
import { HomeComponents } from './job/home/home.component';
import { JobsListComponent } from './job/jobs-list/jobs-list.component';
import { JobDetailsComponent } from './job/job-details/job-details.component';
const routes: Routes = [
  { path: 'jobsList', component: HomeComponents },
  {path:'',component:JobsListComponent},
    { path: 'home', component: HomeComponent },
    { path: 'first-form', component: FirstFormComponent },
    {path:'about',component:AboutComponent},
  {path:'paitents',component:PatientsComponent},
  {path:'jobdetails/:id',component:JobDetailsComponent}
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
