export class Booking {


    constructor(
        public id: string,
        public placeId: string,
        public placeTitle: string,
        public placeImage: string,
        public userId: string,
        public firstname: string,
        public lastname: string,
        public numberOfGuests: number,
        public bookedFrom: Date,
        public bookedTo: Date
    ) {}

}