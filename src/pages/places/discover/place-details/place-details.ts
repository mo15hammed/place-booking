import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, AlertController } from 'ionic-angular';
import { Place } from '../../place.model';
import { AuthService } from '../../../auth/auth.service';
import { CreateBookingComponent } from '../../../../components/create-booking/create-booking';
import { take } from 'rxjs/operators';

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

  private isAuthed = false;
  private isBookable = true;
  private loadedPlace: Place;

  constructor(
    private alertCtrl: AlertController,
    private actSheetCtrl: ActionSheetController,
    private bookingModalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService
    ) {
    this.loadedPlace = navParams.get('place');
  }

  ngOnInit() {

    this.authService.userId.pipe(take(1)).subscribe(userId => {
      this.isBookable = this.loadedPlace.userId != userId;
    });

    this.authService.getIsUserAuthenticated().subscribe(auth => {
      this.isAuthed = auth;
    });

  }

  ionViewDidLoad() {
    console.log(this.loadedPlace.title);
    
  }

  onBookPlace() {
    console.log('Book PLace');
    if (!this.isBookable) {
      return;
    }

    if (!this.isAuthed) {
      this.alertCtrl.create({
        title: 'Unauthorized!',
        message: 'you need to login first to perform this action',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Login',
            handler: () => {
              this.navCtrl.push('AuthPage', {'go_back': 'PlaceDetailsPage'})
            }
          },
          
        ]
      }).present();
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
