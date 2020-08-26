import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { PlacesService } from '../places/places.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { CameraPhoto } from '@capacitor/core';

import firebase from 'firebase/app';
import 'firebase/storage';

import { FIREBASE_CONFIG } from '../../app/firebase.config';


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
  private offerImageUrl: string;
  private isImageLoading = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private placesService: PlacesService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {
      if (firebase.apps.length <= 0) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
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
      image: new FormControl(null, {
        validators: [Validators.required]
      }),
      location: new FormControl(null, {
        validators: [Validators.required]
      })
    });

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddOfferPage');
  }

  onLocationPicked(event: any) {
    console.log(event);
    this.form.patchValue({location: event})
  }

  /**
   * uploads the image to firebase storage and gets the download url of that image
   * @param image the image picked by the user
   */
  onImagePicked(image: CameraPhoto) {
    this.isImageLoading = true;
    let imgFileName = new Date().getTime().toString();

    const imgRef = firebase.storage().ref(`images/${imgFileName}`);
    imgRef.putString(image.dataUrl, 'data_url').then(() => {
      return imgRef.getDownloadURL();
    }).then(downloadableImgUrl => {
      this.offerImageUrl = downloadableImgUrl;
      this.isImageLoading = false;
      this.form.patchValue({image: downloadableImgUrl});
    }).catch(err => {
      console.log("IMAGE ERROR: ", err);
    });

  }

  onAddOffer() {
    
    if (!this.form.valid || !this.datesValid()) {
      return;
    }

    const loading = this.loadingCtrl.create({content: 'Creating new offer...'});
    const alert = this.alertCtrl.create({
      title: 'Offer Created !!',
      message: `You created a new offer with title: ${this.form.value.title}`,
      buttons: ['Okay'],
    });

    

    loading.present();
    this.placesService.addPlace(
      this.form.value.title,
      this.form.value.description,
      this.form.value.price,
      new Date(this.form.value.dateFrom),
      new Date(this.form.value.dateTo),
      this.form.value.image,
      this.form.value.location,
    ).subscribe(() => {
      loading.dismiss();
      alert.present();
      alert.onDidDismiss(() => {
        this.navCtrl.pop();
      });
    }, error => {
      console.log("ERROR: ", error);
      loading.dismiss();
      alert.setTitle('Failed !!');
      alert.setMessage('Something Went Wrong. Please try again')
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
