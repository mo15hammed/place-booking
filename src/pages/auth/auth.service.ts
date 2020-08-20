import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "./user.model";
import { map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { take } from "rxjs/operator/take";
import { switchMap } from "rxjs/operator/switchMap";
import { Storage } from "@capacitor/core";
import { from } from "rxjs/observable/from";

interface AuthResponse {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
}

@Injectable()
export class AuthService {
    constructor(
        private http: HttpClient
    ) {}
    private _user = new BehaviorSubject<User>(new User('', '', 'adasd', new Date()));


    getIsUserAuthenticated() {
        return this._user.asObservable().pipe(
            map(user => {
                return user ? !!user.token : false; 
            })
        )
    }

    get userId() {
        return this._user.asObservable().pipe(
            map(user => {
                return user ? user.id : null; 
            })
        );
    }

    autoLogin() {
        return from(Storage.get({key: 'CURRENT_USER'})).pipe(
            map(currentUserData => {
                if (!currentUserData || !currentUserData.value) {
                    console.log("CURRENT USER DATA: ", currentUserData);
                    return null;
                }

                let user = new User (
                    JSON.parse(currentUserData.value).id,
                    JSON.parse(currentUserData.value).email,
                    JSON.parse(currentUserData.value)._token,
                    JSON.parse(currentUserData.value).tokenExpirationDate,
                );
                
                if (!!user.token) {
                    console.log("TOKEN EXPIRED: ", user.token);
                }

                return user;
            }),
            tap(currentUser => {
                this._user.next(currentUser);
            }),
            map (currentUser => {
                return !!currentUser;
            })
        );
    }

    logout() {
        this._user.next(null);
        Storage.remove({key: 'CURRENT_USER'});
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB9Q7uAuGcRgwLuyIxHNGSqdXMzxi1KXtg',
            {email: email, password: password, returnSecureToken: true}
            ).pipe(
              tap( resData => {
                    this.setUserData(resData);
                })
            );
    }

    signup(email: string, password: string) {
        return this.http.post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB9Q7uAuGcRgwLuyIxHNGSqdXMzxi1KXtg',
            {email: email, password: password, returnSecureToken: true}
            ).pipe(
                tap(res => {
                    this.setUserData(res);
                })
            );
    }

    setUserData(resData: AuthResponse) {

        const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
        const user = new User (resData.localId, resData.email, resData.idToken, expirationDate)
        this._user.next(user);
        
        this.storeAuthData(user);
    
      }

    storeAuthData(user: User) {
        Storage.set({
            key: 'CURRENT_USER',
            value: JSON.stringify(user)
          })
    }

}