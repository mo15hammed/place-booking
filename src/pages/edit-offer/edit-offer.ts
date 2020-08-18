import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Place } from '../places/place.model';
import { PlaceLocation } from '../places/location.model';
import { PlacesService } from '../places/places.service';

/**
 * Generated class for the EditOfferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-offer',
  templateUrl: 'edit-offer.html',
})
export class EditOfferPage {
  
  private form: FormGroup;

  private offer: Place;
  private placeLocation: PlaceLocation;

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private placesService: PlacesService
    ) {
    this.offer = navParams.get('offer');
    this.placeLocation = this.offer.location;
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(this.offer.title, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      description: new FormControl(this.offer.description, {
        updateOn: 'change',
        validators: [Validators.required, Validators.minLength(4), Validators.maxLength(180)]
      }),
      price: new FormControl(this.offer.price, {
        updateOn: 'change',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(this.offer.availableFrom.toISOString(), {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(this.offer.availableTo.toISOString(), {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      location: new FormControl(this.placeLocation, {
        validators: [Validators.required]
      })
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditOfferPage');
  }


  onLocationPicked(event) {
    console.log(event);
    this.form.patchValue({location: event})
  }

  onEditOffer() {
  
    if (!this.form.valid || !this.datesValid()) {
      return;
    }
    
    const loading = this.loadingCtrl.create({content: 'Updating offer data...'});
    const alert = this.alertCtrl.create({
      title: 'Offer Updated !!',
      message: `You have updated this offer successfully!`,
      buttons: ['Okay'],
    });

    alert.onDidDismiss(() => {
      this.navCtrl.pop();
    })

    loading.present();
    this.placesService.editPlace(
      this.offer.id,
      this.form.value.title,
      this.form.value.description,
      this.form.value.price,
      new Date(this.form.value.dateFrom),
      new Date(this.form.value.dateTo),
      this.form.value.location,
    ).subscribe(() => {
      loading.dismiss();
      alert.present();
    })

  }

  datesValid() {
    
    if (this.form && this.form.value['dateFrom'] && this.form.value['dateTo']) {
      
      const startDate = new Date(this.form.value['dateFrom']);
      const endDate = new Date(this.form.value['dateTo']);
      
      return endDate >= startDate;
    }
    return false;
  }
}
