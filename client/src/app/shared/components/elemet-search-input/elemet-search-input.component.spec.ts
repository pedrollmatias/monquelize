import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElemetSearchInputComponent } from './elemet-search-input.component';

describe('ElemetSearchInputComponent', () => {
  let component: ElemetSearchInputComponent;
  let fixture: ComponentFixture<ElemetSearchInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElemetSearchInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElemetSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
