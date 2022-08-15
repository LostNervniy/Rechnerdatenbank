import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComputerDialogComponent } from './edit-computer-dialog.component';

describe('EditComputerDialogComponent', () => {
  let component: EditComputerDialogComponent;
  let fixture: ComponentFixture<EditComputerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditComputerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComputerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
