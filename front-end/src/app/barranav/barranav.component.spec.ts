import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarranavComponent } from './barranav.component';

describe('BarranavComponent', () => {
  let component: BarranavComponent;
  let fixture: ComponentFixture<BarranavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarranavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarranavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
