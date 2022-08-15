import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewComputerDialogComponent } from './new-computer-dialog.component';

describe('NewComputerDialogComponent', () => {
  let component: NewComputerDialogComponent;
  let fixture: ComponentFixture<NewComputerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewComputerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewComputerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
