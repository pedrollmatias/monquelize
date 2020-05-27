import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementFormFieldComponent } from './element-form-field.component';

describe('ElementFormFieldComponent', () => {
  let component: ElementFormFieldComponent;
  let fixture: ComponentFixture<ElementFormFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementFormFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
