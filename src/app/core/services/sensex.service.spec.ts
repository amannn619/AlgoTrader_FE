import { TestBed } from '@angular/core/testing';

import { SensexService } from './sensex.service';

describe('SensexService', () => {
  let service: SensexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SensexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
