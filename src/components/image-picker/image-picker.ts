import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Capacitor, CameraPhoto } from '@capacitor/core';

/**
 * Generated class for the ImagePickerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'image-picker',
  templateUrl: 'image-picker.html'
})
export class ImagePickerComponent {

  @Input() imageUrl: string;
  @Input() isImageLoading = false;
  @Output() imagePick = new EventEmitter<CameraPhoto>();
  constructor() {
    console.log('Hello ImagePickerComponent Component');
  }


  onPickImage() {

    if(!Capacitor.isPluginAvailable('Camera')) {
      return;
    }

    Camera.getPhoto({
      quality: 90,
      source: CameraSource.Prompt,
      saveToGallery: true,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.DataUrl
    }).then(image => {
      this.imagePick.emit(image);
    }).catch(err => {
      console.log("IMAGE PICKER: " + err);
    });


  }

}