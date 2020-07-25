import { TestBed } from '@angular/core/testing';

import { ApiReportService } from './api-report.service';

describe('ApiReportService', () => {
  let service: ApiReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
