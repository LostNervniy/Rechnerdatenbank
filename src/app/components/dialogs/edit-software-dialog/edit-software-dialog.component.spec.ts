import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSoftwareDialogComponent } from './edit-software-dialog.component';

describe('EditSoftwareDialogComponent', () => {
  let component: EditSoftwareDialogComponent;
  let fixture: ComponentFixture<EditSoftwareDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSoftwareDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSoftwareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
