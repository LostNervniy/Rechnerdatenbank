import { TestBed } from '@angular/core/testing';

import { RoomDataService } from './room-data.service';

describe('RoomDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoomDataService = TestBed.get(RoomDataService);
    expect(service).toBeTruthy();
  });
});
