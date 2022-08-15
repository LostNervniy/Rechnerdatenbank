import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOperatingsystemDialogComponent } from './edit-operatingsystem-dialog.component';

describe('EditOperatingsystemDialogComponent', () => {
  let component: EditOperatingsystemDialogComponent;
  let fixture: ComponentFixture<EditOperatingsystemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOperatingsystemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOperatingsystemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
