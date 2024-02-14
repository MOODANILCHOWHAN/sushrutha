import { Component } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [MatMenuTrigger]
})
export class HomeComponent {

  constructor (private router:Router){}

  showMenu: boolean = false;

  show() {
    if (this.showMenu==false) {
      this.showMenu=true
    }
    else{
      this.showMenu=false
    }
    console.log(this.showMenu)
  }
  ads=[
    {
      src:'assets/slides/1.jpeg',
    },
    {
      src:'assets/slides/2.jpg',
    },
    {
      src:'assets/slides/3.jpg',
    },
    {
      src:'assets/slides/4.jpg',
    },
  ]

  navToAppointment()
  {
    this.router.navigate(['first-form'])
  }
  navToAbout()
  {
    // this.router.navigate(['about'])
  }
  navTodaysAppointment()
  {
    this.router.navigate(['paitents'])
  }
}
