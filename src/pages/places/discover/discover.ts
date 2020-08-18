import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Segment } from 'ionic-angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { AuthService } from '../../auth/auth.service';


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
  private relevantPlaces: Place[];
  private loadedListPlaces: Place[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private placesService: PlacesService, private authService: AuthService) {
  }


  ngOnInit() {
    this.selectedPlaces = 'all';
    this.isLoading = true;
    this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      if (this.selectedPlaces == 'bookable') {
        this.relevantPlaces = this.loadedPlaces.filter(place => { return place.userId != this.authService.userId });
      } else {
        this.relevantPlaces = this.loadedPlaces;
      }
      this.loadedListPlaces = this.relevantPlaces.slice(1);
    });

  }

  ionViewWillEnter() {
    this.placesService.fetchPlaces().subscribe(() => this.isLoading = false);
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
    this.selectedPlaces = ev.value;
    if (this.selectedPlaces == 'bookable') {
      this.relevantPlaces = this.loadedPlaces.filter(place => { return place.userId != this.authService.userId });
    } else {
      this.relevantPlaces = this.loadedPlaces;
    }
    this.loadedListPlaces = this.relevantPlaces.slice(1);
    
  }
}
