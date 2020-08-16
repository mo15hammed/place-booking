import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PlacesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-places',
  templateUrl: 'places.html',
})
export class PlacesPage {

  discover = 'DiscoverPage';
  offers = 'OffersPage';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad PlacesPage');
  }

  onClick() {
    console.log('!!!!!!!!!!!!!!!!!!!!!!');
    
    this.navCtrl.push('BookingsPage');
  }

  openPage(page: string) {
    console.log('Page Opened !!');

  }

}
