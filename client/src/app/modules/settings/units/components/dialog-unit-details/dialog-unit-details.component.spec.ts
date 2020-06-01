import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUnitDetailsComponent } from './dialog-unit-details.component';

describe('DialogUnitDetailsComponent', () => {
  let component: DialogUnitDetailsComponent;
  let fixture: ComponentFixture<DialogUnitDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUnitDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUnitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
