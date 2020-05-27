import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementBreadcrumbComponent } from './element-breadcrumb.component';

describe('ElementBreadcrumbComponent', () => {
  let component: ElementBreadcrumbComponent;
  let fixture: ComponentFixture<ElementBreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementBreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
