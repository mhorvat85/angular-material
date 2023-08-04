import { Component } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-bottom-sheet-menu',
  templateUrl: './bottom-sheet-menu.component.html',
  styleUrls: ['./bottom-sheet-menu.component.css'],
})
export class BottomSheetMenuComponent {
  constructor(private sharedService: SharedService) {}

  onDeleteClick() {
    this.sharedService.emitValue('Delete Booking');
  }

  onArchiveClick() {
    this.sharedService.emitValue('Archive Booking');
  }
}
