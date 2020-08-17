import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Place } from '../../place.model';

/**
 * Generated class for the PlaceDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-place-details',
  templateUrl: 'place-details.html',
})
export class PlaceDetailsPage {

  private loadedPlace: Place;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.loadedPlace = navParams.get('place');
  }

  ionViewDidLoad() {
    console.log(this.loadedPlace.title);
    
  }

  onBookPlace() {
    console.log('Book PLace');
    
  }
}
