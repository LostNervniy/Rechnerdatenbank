import { TestBed } from '@angular/core/testing';

import { SoftwareDataService } from './software-data.service';

describe('SoftwareDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SoftwareDataService = TestBed.get(SoftwareDataService);
    expect(service).toBeTruthy();
  });
});
