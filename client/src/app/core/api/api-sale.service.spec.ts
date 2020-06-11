import { TestBed } from '@angular/core/testing';

import { ApiSaleService } from './api-sale.service';

describe('ApiSaleService', () => {
  let service: ApiSaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiSaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
