import { NgModule } from '@angular/core';
import { LocationPickerComponent } from './location-picker/location-picker';
import { MapModalComponent } from './map-modal/map-modal';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { CreateBookingComponent } from './create-booking/create-booking';
@NgModule({
	declarations: [LocationPickerComponent, MapModalComponent,
    CreateBookingComponent],
	imports: [CommonModule, IonicModule],
	exports: [LocationPickerComponent],
	entryComponents: [MapModalComponent, CreateBookingComponent]
})
export class ComponentsModule {}
