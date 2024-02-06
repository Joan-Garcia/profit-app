import { TestBed } from '@angular/core/testing';

import { BanxicoApiService } from './banxico-api.service';

describe('BanxicoApiService', () => {
  let service: BanxicoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BanxicoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
