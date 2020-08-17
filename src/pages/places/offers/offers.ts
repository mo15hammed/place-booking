import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding } from 'ionic-angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';


/**
 * Generated class for the OffersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-offers',
  templateUrl: 'offers.html',
})
export class OffersPage implements OnInit{

  private isLoading = false;
  private loadedOffers: Place[];
  constructor(public navCtrl: NavController, public navParams: NavParams, private placesService: PlacesService) {
  }

  ngOnInit() {
    this.placesService.places.subscribe(offers => {
      this.loadedOffers = offers;
      console.log(offers);
      
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchOffers().subscribe(offers => { 
      this.isLoading = false;
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OffersPage');
    
  }

  onOfferDetails(offer: Place) {
    console.log('Open Offer');
    this.navCtrl.push('OfferDetailsPage', {offer: offer})
  }

  onEdit(offer: Place, ionItemSliding: ItemSliding) {
    console.log('Edit Offer');

    ionItemSliding.close();
    
  }

  onAdd() {
    console.log('Add Offer');
    
  }

}
