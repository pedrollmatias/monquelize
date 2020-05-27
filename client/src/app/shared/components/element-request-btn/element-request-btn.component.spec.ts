import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementRequestBtnComponent } from './element-request-btn.component';

describe('ElementRequestBtnComponent', () => {
  let component: ElementRequestBtnComponent;
  let fixture: ComponentFixture<ElementRequestBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementRequestBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementRequestBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
