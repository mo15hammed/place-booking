import { NgModule } from '@angular/core';
import { LocationPickerComponent } from './location-picker/location-picker';
import { IonicModule } from 'ionic-angular';
import { CreateBookingComponent } from './create-booking/create-booking';
import { ImagePickerComponent } from './image-picker/image-picker';
@NgModule({
	declarations: [LocationPickerComponent,
    CreateBookingComponent,
    ImagePickerComponent],
	imports: [IonicModule],
	exports: [LocationPickerComponent, ImagePickerComponent],
	entryComponents: [CreateBookingComponent]
})
export class ComponentsModule {}
