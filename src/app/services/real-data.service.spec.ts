import { TestBed } from '@angular/core/testing';

import { RealDataService } from './real-data.service';

describe('RealDataService', () => {
  let service: RealDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
