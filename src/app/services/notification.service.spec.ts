import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MatSnackBar, useValue: {} }],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
