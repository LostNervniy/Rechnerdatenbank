import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRamDialogComponent } from './edit-ram-dialog.component';

describe('EditRamDialogComponent', () => {
  let component: EditRamDialogComponent;
  let fixture: ComponentFixture<EditRamDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRamDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRamDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
