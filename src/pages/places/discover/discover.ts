import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Segment } from 'ionic-angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';


/**
 * Generated class for the DiscoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html',
})
export class DiscoverPage implements OnInit{
  private isLoading = false;
  private selectedPlaces: string;
  private loadedPlaces: Place[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private placesService: PlacesService) {
  }


  ngOnInit() {
    this.selectedPlaces = 'all';
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => this.isLoading = false);
    this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
    });

  }

  ionViewWillEnter() {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DiscoverPage');
  }

  onOpenPlaceDetails(place: Place) {
    console.log(place);
    this.navCtrl.push('PlaceDetailsPage', {place: place});
  }

  onFilterPlaces(ev: Segment) {
    
    console.log(ev.value);
    
  }
}
