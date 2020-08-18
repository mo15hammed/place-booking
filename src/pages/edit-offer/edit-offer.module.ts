import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditOfferPage } from './edit-offer';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    EditOfferPage,
  ],
  imports: [
    IonicPageModule.forChild(EditOfferPage),
    ComponentsModule
  ],
})
export class EditOfferPageModule {}
