import { TestBed } from '@angular/core/testing';

import { RoomTypesService } from './room-types.service';
import { HttpClient } from '@angular/common/http';

describe('RoomTypesService', () => {
  let service: RoomTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: {} }],
    });
    service = TestBed.inject(RoomTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
