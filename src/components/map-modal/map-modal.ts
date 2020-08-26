import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { GESTURE_PRIORITY_TOGGLE } from 'ionic-angular/umd/gestures/gesture-controller';
import { EventListener } from '@angular/core/src/debug/debug_node';
import { PlaceLocation } from '../../pages/places/location.model';
import { NON_TEXT_INPUT_REGEX } from 'ionic-angular/umd/util/dom';

/**
 * Generated class for the MapModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

 declare var google: any;

@Component({
  selector: 'map-modal',
  templateUrl: 'map-modal.html'
})
export class MapModalComponent implements OnDestroy{

  text: string;

  @ViewChild('map') mapEl: ElementRef;
  map: any;
  marker: any;
  mapClickListenr: EventListener;

  private readonly = false;
  oldPlaceLocation: PlaceLocation = {lat: 0, lng: 0,staticMapImageUrl: "", address: ""};
  newPlaceLocation: PlaceLocation = {lat: 0, lng: 0,staticMapImageUrl: "", address: ""};

  center = new google.maps.LatLng(-34.9290, 138.6010);
  zoom = 10;

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {
    console.log('Hello MapModalComponent Component');
    this.oldPlaceLocation = navParams.get('place-location');
    this.readonly = navParams.get('readonly');
  }


  onSubmit() {
    this.viewCtrl.dismiss(this.newPlaceLocation)
  }

  onCancel() {
    this.viewCtrl.dismiss(this.oldPlaceLocation)
  }

  ionViewDidLoad() {
    
    if (this.oldPlaceLocation) {
      this.center = new google.maps.LatLng(this.oldPlaceLocation.lat, this.oldPlaceLocation.lng);
    }

    this.initMap();
  }


  /**
   * setting up the map and its marker
   */
  initMap() {
    if (google) {
      let mapOptions = {
        center: this.center,
        zoom: this.zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        gestureHandling: "auto"
      }

      this.map = new google.maps.Map(this.mapEl.nativeElement, mapOptions);
      
      if (this.oldPlaceLocation) {

        this.newPlaceLocation.lat = this.oldPlaceLocation.lat;
        this.newPlaceLocation.lng = this.oldPlaceLocation.lng;

        this.marker = new google.maps.Marker({
          map: this.map,
          position: this.center
        })
      }

      if (!this.readonly) {
        this.mapClickListenr = this.map.addListener('click', event => {      
          if (this.marker) {
            this.marker.setMap(null);
          }
          
          this.marker = new google.maps.Marker({
            map: this.map,
            position: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng())
          });
          
          this.newPlaceLocation.lat = this.marker.position.lat();
          this.newPlaceLocation.lng = this.marker.position.lng();

          
        });
      }
    }
  }

  ngOnDestroy() {
    console.log('OnDestroy');

    google.maps.event.removeListener(this.mapClickListenr)
  }

}
