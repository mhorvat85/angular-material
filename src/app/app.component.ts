import { Component, OnInit } from '@angular/core';
import { BookingsService } from './services/bookings.service';
import { Booking } from './models/booking';
import { SharedService } from './services/shared.service';
import { delay, mergeMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  showStatistics: boolean = false;

  bookings: Booking[] = [];
  bookingsThisWeek!: number;
  bookingsThisMonth!: number;
  bookingsThisYear!: number;

  newBookings: Booking[] = [];

  constructor(private bookingsService: BookingsService, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.bookingsService
      .getBookings()
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.noOfBookings(response);
          this.newBookings = response.filter((res: Booking) => res.isNotified === false);
        },
        error: (error) => {
          console.log(error);
        },
      });

    this.sharedService.change
      .pipe(
        delay(100),
        mergeMap((value) => {
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            this.newBookings.push(value);
          }
          if (value && Array.isArray(value) && value.includes('Clear Notification')) {
            this.newBookings = this.newBookings.filter((book) => !value[1].find((val: Booking) => book.id === val.id));
          }
          return this.bookingsService.getBookings();
        })
      )
      .subscribe({
        next: (response) => {
          this.noOfBookings(response);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  noOfBookings(response: Booking[]) {
    this.bookingsThisWeek = this.weeklyBookingsSummary(response);
    this.bookingsThisMonth = this.monthlyBookingsSummary(response);
    this.bookingsThisYear = this.yearlyBookingsSummary(response);
  }

  dateCalculation(): any[] {
    const todayDate = new Date().getDate();
    const todayDay = new Date().getDay();

    const firstDayOfWeek = new Date(new Date().setDate(todayDate - (todayDay - 1))).setHours(0, 0, 0);
    const lastDayOfWeek = new Date(new Date().setDate(todayDate + (7 - todayDay))).setHours(0, 0, 0);

    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
    const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime();

    const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1).getTime();
    const lastDayOfYear = new Date(new Date().getFullYear(), 11, 31).getTime();

    return [firstDayOfWeek, lastDayOfWeek, firstDayOfMonth, lastDayOfMonth, firstDayOfYear, lastDayOfYear];
  }

  weeklyBookingsSummary(bookings: Booking[]): number {
    const [firstDayOfWeek, lastDayOfWeek] = this.dateCalculation();

    let weekBookings: Booking[] = [];
    weekBookings = bookings.filter((booking: Booking) => {
      const checkIn = new Date(booking.checkIn).getTime() + new Date().getTimezoneOffset() * 60 * 1000;

      return checkIn >= firstDayOfWeek && checkIn <= lastDayOfWeek;
    });
    return weekBookings.length;
  }

  monthlyBookingsSummary(bookings: Booking[]): number {
    const [, , firstDayOfMonth, lastDayOfMonth] = this.dateCalculation();

    let monthBookings: Booking[] = [];
    monthBookings = bookings.filter((booking: Booking) => {
      const checkIn = new Date(booking.checkIn).getTime() + new Date().getTimezoneOffset() * 60 * 1000;

      return checkIn >= firstDayOfMonth && checkIn <= lastDayOfMonth;
    });
    return monthBookings.length;
  }

  yearlyBookingsSummary(bookings: Booking[]): number {
    const [, , , , firstDayOfYear, lastDayOfYear] = this.dateCalculation();

    let yearBookings: Booking[] = [];
    yearBookings = bookings.filter((booking: Booking) => {
      const checkIn = new Date(booking.checkIn).getTime() + new Date().getTimezoneOffset() * 60 * 1000;

      return checkIn >= firstDayOfYear && checkIn <= lastDayOfYear;
    });
    return yearBookings.length;
  }

  resetNewBooking($event: any, newBooking: Booking, i: any): void {
    this.bookingsService
      .putBooking({ ...newBooking, isNotified: true })
      .pipe(take(this.newBookings.length))
      .subscribe({
        next: () => {},
        error: (error) => {
          console.log(error);
        },
      });

    this.newBookings.splice(i, 1);

    if (this.newBookings.length > 0) $event.stopPropagation();
  }
}
