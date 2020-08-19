import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Place } from '../../pages/places/place.model';
import { BookingService } from '../../pages/bookings/booking.service';

/**
 * Generated class for the CreateBookingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'create-booking',
  templateUrl: 'create-booking.html'
})
export class CreateBookingComponent implements OnInit{

  private loadedPlace: Place;
  private form: FormGroup;

  private startDate = new Date();
  private endDate = new Date();
  private minDateFrom: string;
  private maxDateFrom: string;
  private minDateTo: string;
  private maxDateTo: string;

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private bookingService: BookingService
  ) {
    console.log('Hello CreateBookingComponent Component');
    this.loadedPlace = navParams.get('place');
    const selectedMode = navParams.get('date');

    if (selectedMode == 'random') {
      this.startDate = new Date(this.loadedPlace.availableFrom.getTime() + Math.random() * (this.loadedPlace.availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - this.loadedPlace.availableFrom.getTime()));
      this.endDate = new Date(new Date(this.startDate).getTime() + Math.random() * (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime()));
    }

    this.minDateFrom = new Date().toISOString();
    this.maxDateFrom = this.loadedPlace.availableTo.toISOString();
    this.minDateTo = this.minDateFrom;
    this.maxDateTo = this.loadedPlace.availableTo.toISOString();
  }

  ngOnInit() {

    this.bookingService.fetchBookings().subscribe();
    this.form = new FormGroup({
      firstname: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      lastname: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      numberOfGuests: new FormControl(2, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateFrom: new FormControl(this.startDate.toISOString(), {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(this.endDate.toISOString(), {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });

    this.form.get('dateFrom').valueChanges.subscribe(dateFrom => {
      this.minDateTo = dateFrom;
      if (new Date(this.form.value.dateTo) < new Date(this.minDateTo)) {
        this.form.get('dateTo').setValue(this.minDateTo);
      }
    })
    
    
  }

  onBookPlace() {
    if (!this.form.valid || !this.datesValid()) {
      return
    }

    const loadingEl = this.loadingCtrl.create({content: `Booking ${this.loadedPlace.title}...`});
    const alertEl = this.alertCtrl.create({
      title: 'Place Booked!',
      message: `You have successfully booked ${this.loadedPlace.title}!`,
      buttons: ['Okay']
    });

    loadingEl.present();
    this.bookingService.addBooking(
      this.form.value.firstname,
      this.form.value.lastname,
      this.form.value.numberOfGuests,
      new Date(this.form.value.dateFrom),
      new Date(this.form.value.dateTo),
      this.loadedPlace
    ).subscribe(() => {
      loadingEl.dismiss();
      alertEl.present();
      alertEl.onDidDismiss(() => {
        this.viewCtrl.dismiss();
      })
    }, error => {
      loadingEl.dismiss();
      console.log("ERROR: ", error);
      alertEl.setTitle('Booking Failed!')
      alertEl.setMessage('Something Went Wrong. Please try again')
      alertEl.present();
    });

  }
  
  onCancel() {
    this.viewCtrl.dismiss();
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
