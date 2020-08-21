import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding, LoadingController, AlertController, MenuController, Refresher } from 'ionic-angular';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';
import { AuthService } from '../auth/auth.service';

/**
 * Generated class for the BookingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
})
export class BookingsPage implements OnInit {

  private isAuthed = false;
  private isLoading = false;
  private loadedBookings: Booking[];

  constructor(
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private bookingService: BookingService,
    private authService: AuthService
    ) {
  }

  ngOnInit() {
    this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
      console.log(this.loadedBookings);
    });
  }

  ionViewCanEnter() {
    this.authService.getIsUserAuthenticated().subscribe(auth => {
      this.isAuthed = auth;
    })
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  doRefresh(refresher: Refresher) {
    this.bookingService.fetchBookings().subscribe(offers => {
      refresher.complete();
    }, error => {
      console.log("ERROR: ", error);
      refresher.complete();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingsPage');
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    }, error => {
      console.log("ERROR: ", error);
      this.isLoading = false;
    });
  }

  onCancelBooking(bookingId: string, ionItemSliding: ItemSliding) {
    console.log("Cancel Booking...");

    const loadingEl = this.loadingCtrl.create({content: 'Canceling...'});
    const alertEl = this.alertCtrl.create({title: 'Canceled !!', message: 'You have canceled this booking successfully!', buttons: ['Okay']});

    loadingEl.present();
    this.bookingService.deleteBooking(bookingId).subscribe(() => {
      loadingEl.dismiss();
      alertEl.present();
    }, error => {
      console.log(error);
      loadingEl.dismiss();
      alertEl.setTitle('Failed !!');
      alertEl.setMessage('Something Went Wrong. Please try again');
      alertEl.present();
    });
    ionItemSliding.close();
  }

  goToLogin() {
    this.navCtrl.push('AuthPage');
  }

}
