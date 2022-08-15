import { TestBed } from '@angular/core/testing';

import { HardwareDataService } from './hardware-data.service';

describe('HardwareDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HardwareDataService = TestBed.get(HardwareDataService);
    expect(service).toBeTruthy();
  });
});
