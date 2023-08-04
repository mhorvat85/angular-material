import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsComponent } from './notifications.component';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsComponent],
      providers: [
        { provide: MAT_SNACK_BAR_DATA, useValue: {} },
        { provide: MatSnackBarRef, useValue: {} },
      ],
      imports: [MatIconModule],
    });
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
