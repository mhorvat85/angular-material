import { TestBed } from '@angular/core/testing';

import { CitiesService } from './cities.service';
import { HttpClient } from '@angular/common/http';

describe('CitiesService', () => {
  let service: CitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: {} }],
    });
    service = TestBed.inject(CitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
