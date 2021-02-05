import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementDatabaseTimePosComponent } from './element-database-time-pos.component';

describe('ElementDatabaseTimePosComponent', () => {
  let component: ElementDatabaseTimePosComponent;
  let fixture: ComponentFixture<ElementDatabaseTimePosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElementDatabaseTimePosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementDatabaseTimePosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
