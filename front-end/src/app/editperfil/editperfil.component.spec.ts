import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditperfilComponent } from './editperfil.component';

describe('EditperfilComponent', () => {
  let component: EditperfilComponent;
  let fixture: ComponentFixture<EditperfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditperfilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditperfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
