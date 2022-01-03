import { TestBed } from '@angular/core/testing';

import { DataStructuresService } from './data-structures.service';

describe('DataStructuresService', () => {
  let service: DataStructuresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataStructuresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
