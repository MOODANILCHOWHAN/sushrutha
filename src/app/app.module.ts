import { NgModule } from '@angular/core';

import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FirstFormComponent } from './first-form/first-form.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AboutComponent } from './about/about.component';
import { HttpClientModule } from '@angular/common/http';
import { PatientsComponent } from './patients/patients.component';
import { MatTableModule } from '@angular/material/table';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatInputModule } from '@angular/material/input';
import { HomeComponents } from './job/home/home.component';
import { JobDetailsComponent } from './job/job-details/job-details.component';
import { AlignItemCenterDirective } from './align-item-center.directive';
import { JobsListComponent } from './job/jobs-list/jobs-list.component';
import { DaysAgoPipe } from './days-ago.pipe';
import { JobsCardComponent } from './job/model/jobs-card/jobs-card.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FirstFormComponent,
    AboutComponent,
    PatientsComponent,
    HomeComponents,
    JobDetailsComponent,
    AlignItemCenterDirective,
    JobsListComponent,
    DaysAgoPipe,
    JobsCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatMenuModule,
    MatButtonModule,
    HttpClientModule,
    MatTableModule,
    MatInputModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
