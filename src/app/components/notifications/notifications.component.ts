import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  textCssClass: string = '';

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBarRef: MatSnackBarRef<NotificationsComponent>,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.textCssClass =
      this.data.messageType == 'success' ? 'text-green' : this.data.messageType == 'error' ? 'text-red' : 'text-black';

    this.sharedService.emitValue('Update Date');
  }
}
