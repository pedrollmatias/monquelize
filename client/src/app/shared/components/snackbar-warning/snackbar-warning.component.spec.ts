import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarWarningComponent } from './snackbar-warning.component';

describe('SnackbarWarningComponent', () => {
  let component: SnackbarWarningComponent;
  let fixture: ComponentFixture<SnackbarWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnackbarWarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
