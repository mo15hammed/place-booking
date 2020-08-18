import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { Place } from '../places/place.model';
import { PlacesService } from '../places/places.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

/**
 * Generated class for the AddOfferPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-offer',
  templateUrl: 'add-offer.html',
})
export class AddOfferPage {

  private form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private placesService: PlacesService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.minLength(4), Validators.maxLength(180)]
      }),
      price: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(new Date().toISOString(), {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(new Date().toISOString(), {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddOfferPage');
  }

  onAddOffer() {
    console.log(this.datesValid());
    
    const loading = this.loadingCtrl.create({content: 'Creating new offer...'});
    const alert = this.alertCtrl.create({
      title: 'Offer Created !!',
      message: `You created a new offer with title: ${this.form.value.title}`,
      buttons: ['Okay'],
    });

    alert.onDidDismiss(() => {
      this.navCtrl.pop();
    })

    loading.present();
    this.placesService.addPlace(
      this.form.value.title,
      this.form.value.description,
      this.form.value.price,
      new Date(this.form.value.dateFrom),
      new Date(this.form.value.dateTo),
      null
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
