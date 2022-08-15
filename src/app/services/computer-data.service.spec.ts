import { TestBed } from '@angular/core/testing';

import { ComputerDataService } from './computer-data.service';

describe('ComputerDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComputerDataService = TestBed.get(ComputerDataService);
    expect(service).toBeTruthy();
  });
});
