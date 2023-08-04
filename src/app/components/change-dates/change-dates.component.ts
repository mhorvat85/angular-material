import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Booking } from 'src/app/models/booking';
import { BookingsService } from 'src/app/services/bookings.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Subscription } from 'rxjs';
import { DateRangeValidatorService } from 'src/app/services/date-range-validator.service';

@Component({
  selector: 'app-change-dates',
  templateUrl: './change-dates.component.html',
  styleUrls: ['./change-dates.component.css'],
})
export class ChangeDatesComponent implements OnInit {
  formGroup: FormGroup | any;
  isWorking: boolean = false;

  subscription!: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: Booking,
    public matDialogRef: MatDialogRef<ChangeDatesComponent>,
    private bookingsService: BookingsService,
    private notificationService: NotificationService,
    private dateValidator: DateRangeValidatorService
  ) {
    this.formGroup = new FormGroup(
      {
        checkIn: new FormControl(null),
        checkOut: new FormControl(null),
      },
      {
        validators: [this.dateValidator.datesMustBeValid()],
        updateOn: 'change',
      }
    );
  }

  ngOnInit(): void {
    this.formGroup.patchValue({
      checkIn: this.dialogData.checkIn,
      checkOut: this.dialogData.checkOut,
    });
  }

  onCancelClick() {
    this.matDialogRef.close();
  }

  convertStartDate(event: any) {
    let newDate = event.value;
    newDate = new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60 * 1000);
    this.formGroup.patchValue({ checkIn: newDate });
    let d: Date = new Date(this.formGroup.value.checkIn);
    d.setDate(d.getDate() + 1);

    this.formGroup.patchValue({
      checkOut: d.toISOString(),
    });
  }

  convertEndDate(event: any) {
    let newDate = event.value;
    newDate = new Date(newDate.getTime() - newDate.getTimezoneOffset() * 60 * 1000);
    this.formGroup.patchValue({ checkOut: newDate });
  }

  onSaveClick() {
    if (!this.formGroup.valid) return;

    this.isWorking = true;

    this.subscription = this.bookingsService.putBooking({ ...this.dialogData, ...this.formGroup.value }).subscribe({
      next: (response: Booking) => {
        this.matDialogRef.close({ result: 'Saved', data: response });
        this.isWorking = false;

        this.notificationService.showNotification('Check-In and Check-Out dates updated', 'OK', 'success');
      },
      error: (error) => {
        console.log(error);
        this.isWorking = false;
        this.notificationService.showNotification('Unable to save dates', 'Close', 'error');
      },
    });
    setTimeout(() => {
      this.subscription.unsubscribe();
    }, 50);
  }
}
