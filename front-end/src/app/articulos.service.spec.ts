import { TestBed } from '@angular/core/testing';

import { ArticulosService } from './articulos.service';

describe('ArticulosService', () => {
  let service: ArticulosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticulosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
