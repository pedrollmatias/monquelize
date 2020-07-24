import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementDateSelectorComponent } from './element-date-selector.component';

describe('ElementDateSelectorComponent', () => {
  let component: ElementDateSelectorComponent;
  let fixture: ComponentFixture<ElementDateSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementDateSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementDateSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
