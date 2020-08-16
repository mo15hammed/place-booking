import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'PlacesPage';
  @ViewChild('content') nav: Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menuCtrl: MenuController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
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
        this.nav.setRoot('AuthPage')
        break;
    }
    this.menuCtrl.toggle();
  }
}

