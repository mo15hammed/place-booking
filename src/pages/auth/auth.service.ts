import { Injectable } from "@angular/core";



@Injectable()
export class AuthService {

    private _userId = 'abc';

    get userId() {
        return this._userId;
    }

}