import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementLoadingAreaComponent } from './element-loading-area.component';

describe('ElementLoadingAreaComponent', () => {
  let component: ElementLoadingAreaComponent;
  let fixture: ComponentFixture<ElementLoadingAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementLoadingAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementLoadingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
