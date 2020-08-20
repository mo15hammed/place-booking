import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Booking } from "./booking.model";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../auth/auth.service";
import { tap, take, map, switchMap } from "rxjs/operators";
import { Place } from "../places/place.model";


interface BookingInterface{
    bookedFrom: Date
    bookedTo: Date
    firstname: string,
    numberOfGuests: number
    lastname: string,
    placeId: string,
    placeImage: string,
    placeTitle: string,
    userId: string,
}

@Injectable()
export class BookingService {
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {}
    private _bookings = new BehaviorSubject<Booking[]>([]);

    get bookings() {
        return this._bookings.asObservable();
    }

    /** 
     * fetches all user's booked places from firebase database
     * @returns an Observable
    */
    fetchBookings() {
        const bookings = [];
        return this.authService.userId.pipe(
            take(1),
            switchMap(userId => {
                return this.http
                    .get<{[key: string]: BookingInterface}>(`https://placebooking-5d7b2.firebaseio.com/booked-places.json?orderBy="userId"&equalTo="${userId}"`)
            }),
            take(1),
            map(res => {
                for (let key in res) {
                    bookings.push(new Booking(
                        key,
                        res[key].placeId,
                        res[key].placeTitle,
                        res[key].placeImage,
                        res[key].userId,
                        res[key].firstname,
                        res[key].lastname,
                        res[key].numberOfGuests,
                        new Date(res[key].bookedFrom),
                        new Date(res[key].bookedTo),
                    ));
                }
                return bookings;
            }),
            tap(bookings => {
                this._bookings.next(bookings);
            })
        )

    }

    /**
     * adds a new booking to firebase database
     * @param firstname first name
     * @param lastname last name
     * @param numberOfGuests number of guests
     * @param dateFrom starting date
     * @param dateTo ending date
     * @param place the place that should be booked
     * @returns an Observable
     */
    addBooking(
        firstname: string,
        lastname: string,
        numberOfGuests: number,
        dateFrom: Date,
        dateTo: Date,
        place: Place
    ) {

        let newBooking : Booking;
        return this.authService.userId.pipe(
            take(1),
            switchMap(userId => {
                newBooking = new Booking(
                    new Date().toISOString(),
                    place.id,
                    place.title,
                    place.imageUrl,
                    userId,
                    firstname,
                    lastname,
                    numberOfGuests,
                    dateFrom,
                    dateTo
                );

                return this.http.post<{name: string}>(
                    'https://placebooking-5d7b2.firebaseio.com/booked-places.json',
                    {...newBooking, id: null}
                );

            }),
            switchMap(res => {
                newBooking.id = res.name;
                return this.bookings;
            }),
            take(1),
            tap(bookings => {
                this._bookings.next(bookings.concat(newBooking));
            })
        )

    }


    /**
     * deletes a booking with a given id from firebase database
     * @param bookingId the id of the booking that should be deleted
     * @returns an Observable
     */
    deleteBooking(bookingId: string) {
        return this.http
            .delete(`https://placebooking-5d7b2.firebaseio.com/booked-places/${bookingId}.json`)
            .pipe(
                switchMap(() => {
                    return this.bookings;
                }),
                take(1),
                tap(bookings => {
                    this._bookings.next(bookings.filter(b => b.id != bookingId));
                })
            )
    }
}