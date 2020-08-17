import { Injectable } from "@angular/core";
import { Place } from "./place.model";
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { tap, map } from "rxjs/operators";


interface PlaceInterface {
    availableFrom: Date;
    availableTo: Date;
    description: string;
    imageUrl: string;
    price: number;
    title: string;
    userId: string;
  }
  

@Injectable()
export class PlacesService {

    constructor(private http: HttpClient) {}

    private _places = new BehaviorSubject<Place[]>([new Place(
        "",
        "",
        "",
        "",
        0,
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
    ]);


    get places() {
        return this._places.asObservable();
    }

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

  fetchOffers() {
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
              resData[key].userId,
            ));
          }
        }

        return places.filter(p => {
          return p.userId === 'bc'
        });
      }),
      tap(places => {
        console.log("data fetched again");
        this._places.next(places)
      })
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