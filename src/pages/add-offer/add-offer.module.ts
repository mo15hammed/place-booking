import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddOfferPage } from './add-offer';
import { ComponentsModule } from '../../components/components.module';


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
