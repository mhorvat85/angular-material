import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingComponent } from './booking.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('BookingComponent', () => {
  let component: BookingComponent;
  let fixture: ComponentFixture<BookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingComponent],
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        MatStepperModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatDividerModule,
        MatCheckboxModule,
        MatChipsModule,
        MatSelectModule,
        MatRadioModule,
        MatTabsModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(BookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
