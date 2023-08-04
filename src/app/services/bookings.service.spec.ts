import { TestBed } from '@angular/core/testing';

import { BookingsService } from './bookings.service';
import { HttpClient } from '@angular/common/http';

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: {} }],
    });
    service = TestBed.inject(BookingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
