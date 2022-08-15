import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPcieDialogComponent } from './edit-pcie-dialog.component';

describe('EditPcieDialogComponent', () => {
  let component: EditPcieDialogComponent;
  let fixture: ComponentFixture<EditPcieDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPcieDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPcieDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
