import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "./user.model";
import { map, tap, take } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
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
    private _user = new BehaviorSubject<User>(null);

    /**
     * check if the user's session is still available or not.
     */
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

    /**
     * auto logs the user in if his session is still available.
     */
    autoLogin() {
        return from(Storage.get({key: 'CURRENT_USER'})).pipe(
            map(currentUserData => {
                if (!currentUserData || !currentUserData.value) {
                    
                    return null;
                }

                let user = new User (
                    JSON.parse(currentUserData.value).id,
                    JSON.parse(currentUserData.value).email,
                    JSON.parse(currentUserData.value)._token,
                    new Date(JSON.parse(currentUserData.value).tokenExpirationDate),     // converting global date to local date format
                );                

                return user.token == null ? null : user;
            }),
            tap(currentUser => {
                this._user.next(currentUser);
            }),
            map (currentUser => {
                return !!currentUser;
            })
        );
    }

    /**
     * logs the user out and removes his stored data from the device.
     */
    logout() {
        this._user.next(null);
        Storage.remove({key: 'CURRENT_USER'});
    }

    /**
     * logs the user in using firebase authentication rest api.
     * @param email user's email
     * @param password user's password
     */
    login(email: string, password: string) {
        return this.http.post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB9Q7uAuGcRgwLuyIxHNGSqdXMzxi1KXtg',
            {email: email, password: password, returnSecureToken: true}
            ).pipe(
                tap( resData => {
                    this.setUserData(resData);
                }),
                take(1),
            );
    }

    /**
     * creates a new user and logs him in using firebase authentication rest api.
     * @param email user's email
     * @param password user's password
     */
    signup(email: string, password: string) {
        return this.http.post<AuthResponse>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB9Q7uAuGcRgwLuyIxHNGSqdXMzxi1KXtg',
            {email: email, password: password, returnSecureToken: true}
            ).pipe(
                take(1),
                tap(res => {
                    this.setUserData(res);
                })
            );
    }


    /**
     * sets up cuurent user and store it on the device.
     * @param resData the response of the login/signup request
     */
    setUserData(resData: AuthResponse) {

        const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
        
        const user = new User (resData.localId, resData.email, resData.idToken, expirationDate)
        this._user.next(user);

        this.storeAuthData(user);
    }


    /**
     * Stores current user's authentication data on the device.
     * @param user current user
     */
    storeAuthData(user: User) {
        Storage.set({
            key: 'CURRENT_USER',
            value: JSON.stringify(user)
          });
    }

}