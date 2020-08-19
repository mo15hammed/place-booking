import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlaceDetailsPage } from './place-details';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    PlaceDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(PlaceDetailsPage),
    ComponentsModule
  ],
})
export class PlaceDetailsPageModule {}
