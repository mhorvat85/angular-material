import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsListComponent } from './bookings-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('BookingsListComponent', () => {
  let component: BookingsListComponent;
  let fixture: ComponentFixture<BookingsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingsListComponent],
      providers: [
        { provide: MatBottomSheet, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: MatTableDataSource, useValue: {} },
      ],
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatCheckboxModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        BrowserAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(BookingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
