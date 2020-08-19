import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding, LoadingController, AlertController } from 'ionic-angular';
import { BookingService } from './booking.service';
import { Booking } from './booking.model';

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

  private isLoading = false;
  private loadedBookings: Booking[];

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private bookingService: BookingService
    ) {
  }

  ngOnInit() {
    this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
      console.log(this.loadedBookings);
      
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingsPage');
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

}
