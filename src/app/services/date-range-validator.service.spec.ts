import { TestBed } from '@angular/core/testing';

import { DateRangeValidatorService } from './date-range-validator.service';

describe('DateRangeValidatorService', () => {
  let service: DateRangeValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateRangeValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
