import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDatesComponent } from './change-dates.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ChangeDatesComponent', () => {
  let component: ChangeDatesComponent;
  let fixture: ComponentFixture<ChangeDatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeDatesComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
      ],
      imports: [
        MatIconModule,
        MatFormFieldModule,
        MatNativeDateModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(ChangeDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
