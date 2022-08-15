import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMainboardDialogComponent } from './edit-mainboard-dialog.component';

describe('EditMainboardDialogComponent', () => {
  let component: EditMainboardDialogComponent;
  let fixture: ComponentFixture<EditMainboardDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMainboardDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMainboardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
