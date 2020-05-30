import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementButtonIconTextComponent } from './element-button-icon-text.component';

describe('ElementButtonIconTextComponent', () => {
  let component: ElementButtonIconTextComponent;
  let fixture: ComponentFixture<ElementButtonIconTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementButtonIconTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementButtonIconTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
