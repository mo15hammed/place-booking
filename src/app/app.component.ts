import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { AuthService } from '../pages/auth/auth.service';
import { Plugins, Capacitor } from '@capacitor/core';
const { SplashScreen } = Plugins;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  private isAuthed = false;

  rootPage:any;
  @ViewChild('content') nav: Nav;

  constructor(platform: Platform, private menuCtrl: MenuController, private authService: AuthService) {
    
    platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        
        this.authService.autoLogin().subscribe(auth => {
          this.rootPage = auth ? 'PlacesPage' : 'AuthPage';
          SplashScreen.hide();
        }, error => {
          console.log("AUTO LOGIN ERROR: ", error);
          SplashScreen.hide();
        })

      }
    });
  }

  ngOnInit() {
    

    this.authService.getIsUserAuthenticated().subscribe(auth => {
      this.isAuthed = auth;
    });
  }

  openPage(page: string) {
    console.log('Page Opened !!');
    switch (page) {
      case 'places':
        console.log('open places');
        this.nav.setRoot('PlacesPage')
        break;
      case 'bookings':
        console.log('open bookings');
        this.nav.setRoot('BookingsPage')
        break;
      case 'auth':
        console.log('open auth');
        if (this.isAuthed) {
          console.log('logging out')
          this.authService.logout();
        } else {
          this.nav.push('AuthPage')
        }
        break;
    }
    this.menuCtrl.toggle();
  }
}

