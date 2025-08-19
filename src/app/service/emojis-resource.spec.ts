import { TestBed } from '@angular/core/testing';

import { EmojisResource } from './emojis-resource';

describe('EmojisResource', () => {
  let service: EmojisResource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmojisResource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
