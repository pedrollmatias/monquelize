import { TestBed } from '@angular/core/testing';

import { ApiInventoryService } from './api-inventory.service';

describe('ApiInventoryService', () => {
  let service: ApiInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
