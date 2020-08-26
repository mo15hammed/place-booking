import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { PlaceLocation } from '../../pages/places/location.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Plugins } from '@capacitor/core'
/**
 * Generated class for the LocationPickerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'location-picker',
  templateUrl: 'location-picker.html'
})
export class LocationPickerComponent implements OnInit{

  private isLoading = false;
  @Input() placeLocation = {} as PlaceLocation;
  @Output() locationPick = new EventEmitter<PlaceLocation>();

  private address = "";

  constructor(
    private alertCtrl: AlertController,
    private http: HttpClient
    ) {    
  }

  ngOnInit() {
    console.log('init');
    if (this.placeLocation) {
      this.address = this.placeLocation.address;
    }
  }

  onFindLocation() {
    this.getLocationFromAddress(this.address).subscribe(loc => {
      console.log(loc);
      
    });
  }

  onFindCurrentPosition() {
    this.pickCurrentPosition();
  }


  pickCurrentPosition() {
    console.log('Getting current position...');
    Plugins.Geolocation.getCurrentPosition().then(loc => {
      console.log("COORDS: ", loc.coords);
      this.placeLocation = {lat: loc.coords.latitude, lng: loc.coords.longitude, staticMapImageUrl: "", address: ""};
      this.definePlaceLocation(this.placeLocation);
    }).catch(error => {
      console.log("ERROR: ", error);
      this.alertCtrl.create({title: 'Failed !!', message: 'Something Went Wrong. Please try again', buttons: ['Okay']}).present();
    });
  }

  definePlaceLocation(location: PlaceLocation) {
    this.isLoading = true;
    this.getAddressFromLocation(location.lat, location.lng).subscribe( address => {
      
      if (!location.address || location.address == "") {
        location.address = address;
        console.log("LOCATION ADDRESS ==== ", location.address);
      }
      this.address = this.placeLocation.address;
      location.staticMapImageUrl = this.getStaticImageUrl(location.lat, location.lng);
      this.placeLocation = location
      this.locationPick.emit(this.placeLocation)
      this.isLoading = false;
    }, error => {
      console.log("ERROR: ", error);
      this.isLoading = false;
      this.alertCtrl.create({title: 'Failed !!', message: 'Something Went Wrong. Please try again', buttons: ['Okay']}).present();
      
    })
    

  }

  getLocationFromAddress(adrs: string) {
   
      return this.http.get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${adrs}&key=AIzaSyCIA_cAN25qbr3CuIxGdj_uhSGZrCccYUg`
      ).pipe(
        map(res => {      
          console.log("RESSSS::::", res);
              
          if(!res || !res.results || res.results.length <= 0) {
            return;
          }
          const lat = res.results[0].geometry.location.lat;
          const lng = res.results[0].geometry.location.lng;

          this.placeLocation = {lat: lat, lng: lng, staticMapImageUrl: "", address: adrs};
          this.definePlaceLocation(this.placeLocation);

          return res.results[0].geometry.location;
        })
      )
    
  }
  

  getAddressFromLocation(lat: number, lng: number) {
    return this.http.get<any>(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCIA_cAN25qbr3CuIxGdj_uhSGZrCccYUg`
    ).pipe(
      map(res => {
        if(!res || !res.results || res.results.length <= 0) {
          return;
        }
        return res.results[0].formatted_address;
      })
    )
  }

  getStaticImageUrl(lat: number, lng: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=10&size=500x300&maptype=roadmap
            &markers=color:red%7C${lat},${lng}&key=AIzaSyCIA_cAN25qbr3CuIxGdj_uhSGZrCccYUg`;
  }

}
