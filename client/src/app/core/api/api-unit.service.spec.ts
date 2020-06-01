import { TestBed } from '@angular/core/testing';

import { ApiUnitService } from './api-unit.service';

describe('ApiUnitService', () => {
  let service: ApiUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiUnitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
