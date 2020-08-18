import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddOfferPage } from './add-offer';
import { LocationPickerComponent } from '../../components/location-picker/location-picker';
import { ComponentsModule } from '../../components/components.module';
import { MapModalComponent } from '../../components/map-modal/map-modal';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AddOfferPage,
  ],
  imports: [
    IonicPageModule.forChild(AddOfferPage),
    ComponentsModule    
  ],
})
export class AddOfferPageModule {}
