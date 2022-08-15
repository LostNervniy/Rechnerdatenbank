import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCpuDialogComponent } from './edit-cpu-dialog.component';

describe('EditCpuDialogComponent', () => {
  let component: EditCpuDialogComponent;
  let fixture: ComponentFixture<EditCpuDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCpuDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCpuDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
