import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { Plugins, Capacitor } from '@capacitor/core';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'PlacesPage';
  @ViewChild('content') nav: Nav;

  constructor(platform: Platform, private menuCtrl: MenuController) {
    platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
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

