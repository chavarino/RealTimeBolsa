import { TestBed } from '@angular/core/testing';

import { TecnicalIndicatorsService } from './tecnical-indicators.service';

describe('TecnicalIndicatorsService', () => {
  let service: TecnicalIndicatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TecnicalIndicatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
