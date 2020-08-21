import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding, MenuController, Refresher } from 'ionic-angular';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';
import { AuthService } from '../../auth/auth.service';
import { switchMap, take, tap, map } from 'rxjs/operators';


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


  private isAuthed = false;
  private isLoading = false;
  private loadedOffers: Place[];
  constructor(
    private menuCtrl: MenuController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private placesService: PlacesService,
    private authService: AuthService,
    ) {
  }

  ngOnInit() {
    // this.placesService.places.subscribe(offers => {
    //   this.loadedOffers = offers;
      
    // });
  }

  ionViewCanEnter() {
    this.authService.getIsUserAuthenticated().subscribe(auth => {
      this.isAuthed = auth;
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  doRefresh(refresher: Refresher) {
    this.getOffers().subscribe(offers => {
      refresher.complete();
      this.loadedOffers = offers;
    }, error => {
      console.log("ERROR: ", error);
      refresher.complete();
    });
  }

  getOffers() {
    let userId = "";
    return this.authService.userId.pipe(
      take(1),
      switchMap(id => {
        userId = id;
        return this.placesService.fetchPlaces();
      }),
      map(places => {
        return places.filter(p => p.userId == userId);
      })
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OffersPage');
    
    this.isLoading = true;

    this.getOffers().subscribe(offers => {
      this.isLoading = false;
      this.loadedOffers = offers;
    }, error => {
      console.log("ERROR: ", error);
      this.isLoading = false;
    });

  }

  onOfferDetails(offer: Place) {
    console.log('Open Offer');
    this.navCtrl.push('OfferDetailsPage', {offer: offer})
  }

  onEdit(offer: Place, ionItemSliding: ItemSliding) {
    console.log('Edit Offer');
    this.navCtrl.push('EditOfferPage', {offer: offer});
    ionItemSliding.close();
    
  }

  onAdd() {
    console.log('Add Offer');
    this.navCtrl.push('AddOfferPage')
  }


  goToLogin() {
    this.navCtrl.push('AuthPage');
  }
}
