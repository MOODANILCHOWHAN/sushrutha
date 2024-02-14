import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
// import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Demo';

  constructor(private platform: Platform, private router: Router) {}

  ngOnInit(): void {
    App.addListener("backButton", () => {
      if (this.router.url === 'home') {
        App['exitApp']();
      } else {
        this.router.navigate(['first-form']);
      }
    });
  }
}
