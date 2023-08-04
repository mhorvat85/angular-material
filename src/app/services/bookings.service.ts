import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Booking } from '../models/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  constructor(private httpClient: HttpClient) {}

  getBookings(): Observable<Booking[]> {
    return this.httpClient.get<Booking[]>(`http://localhost:3000/bookings`);
  }

  postBooking(booking: Booking): Observable<Booking> {
    return this.httpClient.post<Booking>(`http://localhost:3000/bookings`, booking);
  }

  putBooking(booking: Booking): Observable<Booking> {
    return this.httpClient.put<Booking>(`http://localhost:3000/bookings/${booking.id}`, booking);
  }

  deleteBooking(bookings: Booking[]): Observable<Booking[]> {
    let index = 0;
    const deleteBookings: any = () => {
      return this.httpClient.delete<Booking[]>(`http://localhost:3000/bookings/${bookings[index].id}`).pipe(
        mergeMap((value: any) => {
          if (bookings.length - 1 > index) {
            index = index + 1;
            return deleteBookings();
          } else {
            return of(value);
          }
        })
      );
    };
    return deleteBookings();
  }

  archiveBooking(bookings: Booking[]): Observable<Booking[]> {
    let index = 0;
    const archiveBookings: any = () => {
      return this.httpClient
        .put<Booking[]>(`http://localhost:3000/bookings/${bookings[index].id}`, bookings[index])
        .pipe(
          mergeMap((value: any) => {
            if (bookings.length - 1 > index) {
              index = index + 1;
              return archiveBookings();
            } else {
              return of(value);
            }
          })
        );
    };
    return archiveBookings();
  }
}
