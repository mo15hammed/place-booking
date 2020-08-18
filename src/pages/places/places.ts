import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';

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
 

  ngOnInit() {
    console.log("Places starting..............");
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlacesPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter PlacesPage');
  }
}
