import { Injectable } from "@angular/core";
import { Place } from "./place.model";
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { tap, map, take, switchMap } from "rxjs/operators";
import { PlaceLocation } from "./location.model";
import { AuthService } from "../auth/auth.service";


interface PlaceInterface {
    availableFrom: Date;
    availableTo: Date;
    description: string;
    imageUrl: string;
    price: number;
    title: string;
    location: PlaceLocation
    userId: string;
  }
  

@Injectable()
export class PlacesService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  private _places = new BehaviorSubject<Place[]>([new Place(
      "",
      "",
      "",
      "",
      0,
      null,
      null,
      null,
      ''
    ),
    new Place(
      "p2",
      "L'Amour Toujours",
      "A romantic place in Paris.",
      "https://upload.wikimedia.org/wikipedia/commons/e/e6/Paris_Night.jpg",
      199.99,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      null,
      'a'
    ),
    new Place(
      "p3",
      "The Foggy Palace",
      "Not your average city trip.",
      "https://i.pinimg.com/originals/65/8f/77/658f77b9b527f89922ba996560a3e2b0.jpg",
      199.99,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      null,
      'abc'
    ),
  ]);


  get places() {
      return this._places.asObservable();
  }


  /**
   * fetches all places from firebase database
   * @returns an Observable
   */
  fetchPlaces() {
    return this.http
    .get<{[key: string]: PlaceInterface}>('https://placebooking-5d7b2.firebaseio.com/offered-places.json')
    .pipe(
      map(resData => {
        const places = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            places.push(new Place(
              key,
              resData[key].title,
              resData[key].description,
              resData[key].imageUrl,
              resData[key].price,
              new Date(resData[key].availableFrom),
              new Date(resData[key].availableTo),
              resData[key].location,
              resData[key].userId,
            ));
          }
        }

        return places;
      }),
      tap(places => {
        console.log("data fetched again");
        this._places.next(places)
      })
    );
  }

  
  /**
   * fetches all places offered by the current user from firebase database
   * @returns an Observable
   */
  fetchOffers() {
    return this.http
    .get<{[key: string]: PlaceInterface}>(`https://placebooking-5d7b2.firebaseio.com/offered-places.json?orderBy="userId"&equalTo="${this.authService.userId}"`)
    .pipe(
      map(resData => {
        const places = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            places.push(new Place(
              key,
              resData[key].title,
              resData[key].description,
              resData[key].imageUrl,
              resData[key].price,
              new Date(resData[key].availableFrom),
              new Date(resData[key].availableTo),
              resData[key].location,
              resData[key].userId,
            ));
          }
        }

        return places.filter(p => {
          return p.userId === this.authService.userId;
        });
      }),
      tap(places => {
        console.log("data fetched again");
        this._places.next(places)
      })
    );
  }


  /**
   * adds a new place to firebase database
   * @param title title of the new place
   * @param description a short discription for the new place
   * @param price price for the new place
   * @param dateFrom the starting availability date for the place
   * @param dateTo a date in witch the place will no longer be available
   * @param location an object that contains {latitude, longitude, address, staticMapImageUrl}
   * @returns an Observable
   */
  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date, location: PlaceLocation) {

    let generated_id: string;

    const newPlace = new Place(
      new Date().toISOString(),
      title,description,
      "https://i.pinimg.com/originals/65/8f/77/658f77b9b527f89922ba996560a3e2b0.jpg",
      price,
      dateFrom,
      dateTo,
      location,
      this.authService.userId
    );

    return this.http.post<{name: string}>('https://placebooking-5d7b2.firebaseio.com/offered-places.json', {...newPlace, id: null})
    .pipe(
      
      switchMap(res => {
        generated_id = res.name;
        newPlace.id = generated_id;
        return this.places;
      }),
      take(1),
      tap(places => {
        
        this._places.next(places.concat(newPlace));
        
      })
    )

  }

  /**
   * edits an already existing place
   * @param placeId unique id of the place that will be updated
   * @param title the editted title
   * @param description the editted description
   * @param price the editted price
   * @param dateFrom the editted starting availability date
   * @param dateTo the editted date in witch the place will no longer be available
   * @param location the editted object that contains {latitude, longitude, address, staticMapImageUrl}
   * @returns an Observable
   */
  editPlace(placeId: string, title: string, description: string, price: number, dateFrom: Date, dateTo: Date, location: PlaceLocation) {

    let updatedPlaces: Place[];

    return this.fetchOffers().pipe(
      take(1),
      switchMap(places => {
        updatedPlaces = [...places];
        console.log(updatedPlaces);
        const placeIndex = places.findIndex(p => p.id == placeId);
        const oldPlace = updatedPlaces[placeIndex];
        updatedPlaces[placeIndex] = new Place(
          placeId,
          title,
          description,
          oldPlace.imageUrl,
          price,
          dateFrom,
          dateTo,
          location,
          this.authService.userId
        );

        return this.http.put(`https://placebooking-5d7b2.firebaseio.com/offered-places/${placeId}.json`, {...updatedPlaces[placeIndex], id: null});
      }),
      tap(() => {return this._places.next(updatedPlaces)})
    );
  }

}

/**
 
[
        new Place(
          "p1",
          "Manhattan Mansion",
          "In the heart of New York City.",
          "https://1.bp.blogspot.com/-t26_UtH2cyM/UYpbaO1q8zI/AAAAAAAAPJw/879aic4E7-M/s1600/020-P1820020.JPG",
          199.99,
          new Date('2020-01-01'),
          new Date('2020-12-31'),
          'abc'
        ),
        new Place(
          "p2",
          "L'Amour Toujours",
          "A romantic place in Paris.",
          "https://upload.wikimedia.org/wikipedia/commons/e/e6/Paris_Night.jpg",
          199.99,
          new Date('2020-01-01'),
          new Date('2020-12-31'),
          'a'
        ),
        new Place(
          "p3",
          "The Foggy Palace",
          "Not your average city trip.",
          "https://i.pinimg.com/originals/65/8f/77/658f77b9b527f89922ba996560a3e2b0.jpg",
          199.99,
          new Date('2020-01-01'),
          new Date('2020-12-31'),
          'abc'
        ),
        
      ];

 */