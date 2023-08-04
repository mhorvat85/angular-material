import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Chart } from 'angular-highcharts';
import { columnChartOptions } from '../../charts/column-chart';
import { Booking } from 'src/app/models/booking';
import { BookingsService } from 'src/app/services/bookings.service';
import { HotelsService } from 'src/app/services/hotels.service';
import { map, take, mergeMap } from 'rxjs/operators';
import { Hotel } from 'src/app/models/hotel';
import { RoomType } from 'src/app/models/room-type';
import { RoomTypesService } from 'src/app/services/room-types.service';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardGridCols: number = 4;
  cardColspan: number = 2;

  bookings: Booking[] = [];
  availableRooms: number = 0;
  newCustomers!: number;
  totalRevenue!: number;
  columnChart: Chart | any;

  bookingsThisWeek!: number;
  bookingsThisMonth!: number;
  bookingsThisYear!: number;

  bookingsLoadingStarted: boolean = false;

  subscription_1!: Subscription;
  subscription_2!: Subscription;
  subscription_3!: Subscription;
  subscription_4!: Subscription;

  constructor(
    private mediaObserver: MediaObserver,
    private bookingsService: BookingsService,
    private hotelsService: HotelsService,
    private roomTypesService: RoomTypesService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.subscription_1 = this.mediaObserver.asObservable().subscribe((media: MediaChange[]) => {
      if (media.some((mediaChange) => mediaChange.mqAlias == 'lt-sm')) {
        this.dashboardGridCols = 1;
        this.cardColspan = 1;
      } else if (media.some((mediaChange) => mediaChange.mqAlias == 'lt-md')) {
        this.dashboardGridCols = 2;
        this.cardColspan = 2;
      } else {
        this.dashboardGridCols = 4;
        this.cardColspan = 2;
      }
    });

    this.bookingsLoadingStarted = true;
    this.subscription_2 = this.bookingsService.getBookings().subscribe({
      next: (response: any) => {
        this.bookings = response;
        this.newCustomers = this.getCustomers().length;
        this.bookingsLoadingStarted = false;
      },
      error: (error) => {
        console.log(error);
        this.bookingsLoadingStarted = false;
      },
    });

    this.subscription_3 = this.hotelsService
      .getHotels()
      .pipe(
        map((hotels: Hotel[]) => {
          hotels.forEach((hotel: Hotel) => {
            this.availableRooms += hotel.numberOfRooms;
          });
          return this.availableRooms;
        })
      )
      .subscribe({
        next: (response: number) => {
          this.availableRooms = response - this.bookings.length;
        },
        error: (error) => {
          console.log(error);
        },
      });

    this.subscription_4 = this.roomTypesService
      .getRoomTypes()
      .pipe(
        map((rooms: RoomType[]) => {
          const revenueObject = this.revenueCalculation(rooms);

          this.getChartValues(revenueObject);

          const totalRevenue = this.totalRevenueCalculation(revenueObject);
          return totalRevenue;
        })
      )
      .subscribe({
        next: (response: number) => {
          this.totalRevenue = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  revenueCalculation(rooms: RoomType[]): { [key: string]: number } {
    const groupByMonth = this.bookings.reduce((group: { [key: string]: [any] }, booking: Booking) => {
      const checkInDate: any = new Date(booking.checkIn);
      const checkOutDate: any = new Date(booking.checkOut);
      const duration = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      const checkInMonth: string = checkInDate.getMonth();
      group[checkInMonth] = group[checkInMonth] ?? [];
      group[checkInMonth].push([booking.roomType, duration]);

      return group;
    }, {});

    let revenueObject: { [key: string]: number } = {};
    for (const month in groupByMonth) {
      const revenueArray: number[] = groupByMonth[month].map((el: [string, number]): number | any => {
        const filteredRoom = rooms.find((room: RoomType) => room.roomTypeName === el[0]);
        if (filteredRoom)
          return ((el as number | any) = (filteredRoom.price + filteredRoom.price * filteredRoom.vat) * el[1]);
        else return null;
      });
      const revenue = revenueArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      revenueObject[month] = revenue;
    }

    return revenueObject;
  }

  totalRevenueCalculation(revenueObject: { [key: string]: number }): number {
    const totalRevenue = Object.values(revenueObject).reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    return totalRevenue;
  }

  getCustomers(): Booking[] {
    const newBookings = this.bookings.filter(
      (booking: Booking, index: number) =>
        this.bookings.findIndex((item: Booking) => item.creditCardNumber === booking.creditCardNumber) === index
    );
    return newBookings;
  }

  getChartValues(revenueObject: { [key: string]: number }): void {
    this.columnChart = new Chart(columnChartOptions);
    this.columnChart.removeSeries(0);
    this.columnChart.addSeries({
      name: 'Revenue',
      data: [] as number[],
    });
    for (let i = 0; i < 12; i++) {
      if (revenueObject.hasOwnProperty(i)) {
        this.columnChart.addPoint(revenueObject[i]);
      } else {
        this.columnChart.addPoint(0);
      }
    }
  }

  onDeleteBooking(booking: Booking): void {
    this.bookingsService
      .deleteBooking([booking])
      .pipe(
        take(1),
        mergeMap(() => this.bookingsService.getBookings()),
        map((response) => (this.bookings = response)),
        mergeMap(() => this.roomTypesService.getRoomTypes())
      )
      .subscribe({
        next: (response) => {
          this.availableRooms++;
          this.newCustomers = this.getCustomers().length;
          this.getChartValues(this.revenueCalculation(response));
          this.totalRevenue = this.totalRevenueCalculation(this.revenueCalculation(response));

          this.sharedService.emitValue(['Clear Notification', [booking]]);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription_1.unsubscribe();
    this.subscription_2.unsubscribe();
    this.subscription_3.unsubscribe();
    this.subscription_4.unsubscribe();
  }
}
