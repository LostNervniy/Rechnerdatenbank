import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMacAdressDialogComponent } from './edit-mac-adress-dialog.component';

describe('EditMacAdressDialogComponent', () => {
  let component: EditMacAdressDialogComponent;
  let fixture: ComponentFixture<EditMacAdressDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMacAdressDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMacAdressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
