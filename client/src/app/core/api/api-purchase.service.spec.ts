import { TestBed } from '@angular/core/testing';

import { ApiPurchaseService } from './api-purchase.service';

describe('ApiPurchaseService', () => {
  let service: ApiPurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPurchaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
