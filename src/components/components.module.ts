import { NgModule } from '@angular/core';
import { LocationPickerComponent } from './location-picker/location-picker';
import { MapModalComponent } from './map-modal/map-modal';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { CreateBookingComponent } from './create-booking/create-booking';
import { ImagePickerComponent } from './image-picker/image-picker';
@NgModule({
	declarations: [LocationPickerComponent, MapModalComponent,
    CreateBookingComponent,
    ImagePickerComponent],
	imports: [IonicModule],
	exports: [LocationPickerComponent, ImagePickerComponent],
	entryComponents: [MapModalComponent, CreateBookingComponent]
})
export class ComponentsModule {}
