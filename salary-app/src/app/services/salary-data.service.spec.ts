import { TestBed } from '@angular/core/testing';

import { SalaryDataService } from './salary-data.service';

describe('SalaryDataService', () => {
  let service: SalaryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalaryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
