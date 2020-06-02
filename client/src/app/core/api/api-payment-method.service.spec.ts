import { TestBed } from '@angular/core/testing';

import { ApiPaymentMethodService } from './api-payment-method.service';

describe('ApiPaymentMethodService', () => {
  let service: ApiPaymentMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPaymentMethodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
