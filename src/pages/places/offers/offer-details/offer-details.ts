import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';


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

  private offerId: string;
  private loadedOffer: Place;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private placesService: PlacesService
    ) {
    this.loadedOffer = navParams.get('offer');
    this.offerId = navParams.get('offer').id;
  }

  ionViewWillEnter() {
    this.placesService.places.subscribe(places => {      
      this.loadedOffer = places.find(p => {return p.id == this.offerId})
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OfferDetailsPage');
  }


  onEdit(offer: Place) {
    this.navCtrl.push('EditOfferPage', {'offer': offer});
  }
}
