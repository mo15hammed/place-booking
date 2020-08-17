import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Place } from '../../place.model';


/**
 * Generated class for the OfferDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offer-details',
  templateUrl: 'offer-details.html',
})
export class OfferDetailsPage {

  private loadedOffer: Place;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.loadedOffer = navParams.get('offer');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OfferDetailsPage');
  }

}
