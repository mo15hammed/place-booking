import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
import { Place } from '../../place.model';
import { AuthService } from '../../../auth/auth.service';
import { CreateBookingComponent } from '../../../../components/create-booking/create-booking';
import { MapModalComponent } from '../../../../components/map-modal/map-modal';

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
export class PlaceDetailsPage implements OnInit {

  private isBookable = true;
  private loadedPlace: Place;

  constructor(
    private actSheetCtrl: ActionSheetController,
    private bookingModalCtrl: ModalController,
    private mapModalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService
    ) {
    this.loadedPlace = navParams.get('place');
  }

  ngOnInit() {
    this.isBookable = this.loadedPlace.userId != this.authService.userId;
  }

  ionViewDidLoad() {
    console.log(this.loadedPlace.title);
    
  }

  previewMap() {
    this.mapModalCtrl.create(MapModalComponent, {'place-location': this.loadedPlace.location, 'readonly': true}).present();
  }

  onBookPlace() {
    console.log('Book PLace');
    if (!this.isBookable) {
      return;
    }

    const actSheetEl = this.actSheetCtrl.create({
      title: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            console.log('Select Date !!');
            // this.navCtrl.push('CreateBookingPage', {'place': this.loadedPlace, 'date': 'select'});
            const bookingModalEl = this.bookingModalCtrl.create(CreateBookingComponent, {'place': this.loadedPlace, 'date': 'select'});
            bookingModalEl.present();
            bookingModalEl.onDidDismiss(() => {
              console.log('CREATE BOOKING DISMISSED !!');
            });
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            console.log('Random Date !!');
            const bookingModalEl = this.bookingModalCtrl.create(CreateBookingComponent, {'place': this.loadedPlace, 'date': 'random'});
            bookingModalEl.present();
            bookingModalEl.onDidDismiss(() => {
              console.log('CREATE BOOKING DISMISSED !!');
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actSheetEl.present();
    
  }
}
