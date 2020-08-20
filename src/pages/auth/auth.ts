import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

/**
 * Generated class for the AuthPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})
export class AuthPage {

  private isLogin = true;
  private form: FormGroup;

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtrl: MenuController,
    private authService: AuthService,
    ) {

    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.minLength(6)]
      })
    });
  }

  switchAuth() {
    this.isLogin = !this.isLogin;
  }

  onAuthenticate() {

    let authObs: Observable<any>;

    let loadingEl = this.loadingCtrl.create({content: 'Logging in...'});

    if (this.isLogin) {
      console.log('Login');
      loadingEl.setContent('Logging in...').present();
      authObs = this.authService.login(this.form.value.email, this.form.value.password)

    } else {
      console.log('Signup');
      loadingEl.setContent('Signing up...').present();
      authObs = this.authService.signup(this.form.value.email, this.form.value.password)
    }

    authObs.subscribe(() => {
      loadingEl.dismiss();
      this.navCtrl.setRoot('PlacesPage');
    },
    errorRes => {
      console.log(errorRes);
      loadingEl.dismiss();
      const errCode = errorRes.error.error.message;
      let errMsg = "Unable to authenticate! Please check your input and try again."
      switch(errCode) {
        case 'EMAIL_EXISTS':
          errMsg = 'This email address already exsits';
          break;
        case 'EMAIL_NOT_FOUND':
          errMsg = 'This email address could not be found !'
          break;
        case 'INVALID_PASSWORD':
          errMsg = 'This password is incorrect !'
          break;
      }
      this.showAuthFailedAlert(errMsg);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AuthPage');
  }

  skipAuth() {
    this.navCtrl.push('PlacesPage');
    this.authService.getIsUserAuthenticated().subscribe(x => console.log(x));
  }

  showAuthFailedAlert(msg: string) {
    this.alertCtrl.create({title: 'Authentication Failed !!', message: msg, buttons: ['Okay']}).present();
  }

}
