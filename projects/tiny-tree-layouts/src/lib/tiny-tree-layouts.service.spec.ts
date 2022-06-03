import { TestBed } from '@angular/core/testing';

import { TinyTreeLayoutsService } from './tiny-tree-layouts.service';

describe('TinyTreeLayoutsService', () => {
  let service: TinyTreeLayoutsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TinyTreeLayoutsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
