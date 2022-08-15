import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMacDialogComponent } from './add-mac-dialog.component';

describe('AddMacDialogComponent', () => {
  let component: AddMacDialogComponent;
  let fixture: ComponentFixture<AddMacDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMacDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMacDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
