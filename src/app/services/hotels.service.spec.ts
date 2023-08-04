import { TestBed } from '@angular/core/testing';

import { HotelsService } from './hotels.service';
import { HttpClient } from '@angular/common/http';

describe('HotelsService', () => {
  let service: HotelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: {} }],
    });
    service = TestBed.inject(HotelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
