import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCategoryDetailsComponent } from './dialog-category-details.component';

describe('DialogCategoryDetailsComponent', () => {
  let component: DialogCategoryDetailsComponent;
  let fixture: ComponentFixture<DialogCategoryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCategoryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCategoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
