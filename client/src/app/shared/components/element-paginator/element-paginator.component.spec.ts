import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementPaginatorComponent } from './element-paginator.component';

describe('ElementPaginatorComponent', () => {
  let component: ElementPaginatorComponent;
  let fixture: ComponentFixture<ElementPaginatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementPaginatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
