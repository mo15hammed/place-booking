import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Place } from '../../place.model';
import { MapModalComponent } from '../../../../components/map-modal/map-modal';


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

  constructor(
    private mapModalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams
    ) {
    this.loadedOffer = navParams.get('offer');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OfferDetailsPage');
  }


  onEdit(offer: Place) {
    this.navCtrl.push('EditOfferPage', {'offer': offer});
  }

  previewMap() {
    this.mapModalCtrl.create(MapModalComponent, {'place-location': this.loadedOffer.location, 'readonly': true}).present();
  }
}
