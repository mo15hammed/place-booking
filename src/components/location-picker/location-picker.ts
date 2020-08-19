import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController, ActionSheetController, AlertController } from 'ionic-angular';
import { MapModalComponent } from '../map-modal/map-modal';
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

  constructor(
    private actSheetCtrl: ActionSheetController,
    private mapModalCtrl: ModalController,
    private alertCtrl: AlertController,
    private http: HttpClient
    ) {    
  }

  ngOnInit() {
    console.log('init');
    
  }

  onPickLocation() {
    this.actSheetCtrl.create({
      title: 'How to pick location ?',
      buttons: [
        {
          text: 'Pick manually',
          handler: () => {
            this.presentMapModal();
          }
        },
        {
          text: 'Current location',
          handler: () => {
            this.pickCurrentPosition();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).present();


  }

  presentMapModal() {
    console.log('Pick Location !!');
    let mapModalEl = this.mapModalCtrl.create(MapModalComponent, {'place-location': this.placeLocation});
    mapModalEl.present();
  
    mapModalEl.onDidDismiss(location => {
      if (this.placeLocation != location) {
        this.definePlaceLocation(location);
      }
    });
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
    this.getLocationAddress(location.lat, location.lng).subscribe( address => {
      location.address = address;
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

  getLocationAddress(lat: number, lng: number) {
    return this.http.get<any>(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBf6qT_VJPiLHb9eY7RBdIZ7qPuwEJuzCA`
    ).pipe(
      map(res => {
        if(!res || !res.results || res.results.length <= 0) {
          return;
        }
        return res.results[1].formatted_address;
      })
    )
  }

  getStaticImageUrl(lat: number, lng: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=10&size=500x300&maptype=roadmap
            &markers=color:red%7C${lat},${lng}&key=AIzaSyBf6qT_VJPiLHb9eY7RBdIZ7qPuwEJuzCA`;
  }

}
