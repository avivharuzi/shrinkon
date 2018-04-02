import { TestBed, inject } from '@angular/core/testing';

import { ShrinkService } from './shrink.service';

describe('ShrinkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShrinkService]
    });
  });

  it('should be created', inject([ShrinkService], (service: ShrinkService) => {
    expect(service).toBeTruthy();
  }));
});
