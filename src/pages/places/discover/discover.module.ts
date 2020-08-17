import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiscoverPage } from './discover';
import { PlaceDetailsPage } from './place-details/place-details';

@NgModule({
  declarations: [
    DiscoverPage,
  ],
  imports: [
    IonicPageModule.forChild(DiscoverPage),
  ]
})
export class DiscoverPageModule {}
