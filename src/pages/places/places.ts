import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

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

  constructor(private menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams) {
  }
 

  ngOnInit() {
    console.log("Places starting..............");
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlacesPage');
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    console.log('ionViewWillEnter PlacesPage');
  }
}
