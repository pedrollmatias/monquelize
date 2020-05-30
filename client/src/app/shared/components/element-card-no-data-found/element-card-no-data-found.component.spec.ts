import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementCardNoDataFoundComponent } from './element-card-no-data-found.component';

describe('ElementCardNoDataFoundComponent', () => {
  let component: ElementCardNoDataFoundComponent;
  let fixture: ComponentFixture<ElementCardNoDataFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementCardNoDataFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementCardNoDataFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
