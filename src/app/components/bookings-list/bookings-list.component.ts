import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Booking } from 'src/app/models/booking';
import { BookingsService } from 'src/app/services/bookings.service';
import { BottomSheetMenuComponent } from '../bottom-sheet-menu/bottom-sheet-menu.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ChangeDatesComponent } from '../change-dates/change-dates.component';
import { DialogService } from 'src/app/services/dialog.service';
import { Subscription, EMPTY } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.css'],
})
export class BookingsListComponent implements OnInit, OnDestroy {
  bookings!: MatTableDataSource<Booking>;
  columnsToDisplay = ['select', 'customerName', 'checkIn', 'status', 'roomType', 'phone'];
  bookingLoadingStatus: string = 'Loading...';
  isLoadingCompleted: boolean = false;
  isError: boolean = false;
  rows: Booking[] = [];
  formGroup: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selection: SelectionModel<Booking> = new SelectionModel<Booking>(true, []);

  archived: boolean[] = [];

  subscription_1!: Subscription;
  subscription_2!: Subscription;
  subscription_3!: Subscription;

  constructor(
    private bookingsService: BookingsService,
    private matBottomSheet: MatBottomSheet,
    private dialogService: DialogService,
    private sharedService: SharedService
  ) {
    this.formGroup = new FormGroup({
      search: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.isLoadingCompleted = false;

    this.subscription_1 = this.bookingsService.getBookings().subscribe({
      next: (response: Booking[]) => {
        response.forEach((res, index) => (this.archived[index] = res.isArchived));
        this.createTableDataSource(response);
      },
      error: (error) => {
        console.log(error);
        this.isError = true;
        this.bookingLoadingStatus = 'Error fetching the data';
      },
    });

    this.subscription_2 = this.sharedService.change
      .pipe(
        mergeMap((value: string) => {
          if (typeof value === 'string' && value == 'Delete Booking' && this.selection.selected.length) {
            this.sharedService.emitValue(['Clear Notification', this.selection.selected]);
            return this.bookingsService.deleteBooking(this.selection.selected);
          } else {
            return EMPTY;
          }
        }),
        mergeMap(() => {
          this.matBottomSheet.dismiss();
          this.selection.clear();
          return this.bookingsService.getBookings();
        }),
        map((response) => {
          return this.createTableDataSource(response);
        })
      )
      .subscribe({
        next: () => {},
        error: (error: any) => {
          console.log(error);
          this.isError = true;
          this.bookingLoadingStatus = 'Error fetching the data';
        },
      });

    this.subscription_3 = this.sharedService.change
      .pipe(
        mergeMap((value: string) => {
          if (typeof value === 'string' && value == 'Archive Booking' && this.selection.selected.length) {
            let selectedItems = this.selection.selected.map((s) => {
              return { ...s, ...{ isArchived: true } };
            });
            this.sharedService.emitValue(['Clear Notification', this.selection.selected]);
            return this.bookingsService.archiveBooking(selectedItems);
          } else return EMPTY;
        }),
        mergeMap(() => {
          this.matBottomSheet.dismiss();
          this.selection.clear();
          return this.bookingsService.getBookings();
        }),
        map((response) => {
          response.forEach((res, index) => (this.archived[index] = res.isArchived));
          this.createTableDataSource(response);
        })
      )
      .subscribe({
        next: () => {},
        error: (error) => {
          console.log(error);
          this.isError = true;
          this.bookingLoadingStatus = 'Error fetching the data';
        },
      });
  }

  createTableDataSource(elements: Booking[]) {
    this.bookings = new MatTableDataSource<Booking>(elements);
    this.rows = elements;
    this.isLoadingCompleted = true;

    this.bookings.paginator = this.paginator;
    this.bookings.sort = this.sort;

    this.bookings.filterPredicate = (data: any, filter: any) => {
      return this.columnsToDisplay.some((column, i) => {
        return column != 'select' && data[column] && data[column].toString().toLowerCase().indexOf(filter) != -1;
      });
    };
  }

  filterBookings() {
    if (this.formGroup.value.search != null && this.bookings) {
      this.bookings.filter = this.formGroup.value.search.trim();
    }
  }

  clearFilter() {
    this.formGroup.patchValue({ search: '' });
    this.filterBookings();
  }

  isAllSelected(): boolean | null {
    if (this.bookings) {
      const numSelected = this.selection.selected.length;
      const numRows = this.bookings.data.length;
      return numSelected == numRows;
    } else {
      return null;
    }
  }

  masterToggle() {
    if (this.bookings) {
      if (this.isAllSelected()) {
        this.selection.clear();
      } else {
        this.bookings.data.forEach((row: any) => this.selection.select(row));
      }
    }
  }

  openBottomSheet() {
    this.matBottomSheet.open(BottomSheetMenuComponent);
  }

  onChangeDatesClick(booking: Booking) {
    let dialogRef: MatDialogRef<ChangeDatesComponent> = this.dialogService.openDateChangerDialog(booking);
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult && dialogResult.data) {
        this.rows = this.rows.map((booking) => {
          if (booking.id == dialogResult.data.id) {
            booking = { ...booking, checkIn: dialogResult.data.checkIn, checkOut: dialogResult.data.checkOut };
          }

          return booking;
        });

        this.createTableDataSource(this.rows);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription_1.unsubscribe();
    this.subscription_2.unsubscribe();
    this.subscription_3.unsubscribe();
  }
}
