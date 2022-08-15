import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowComputerOfUserDialogComponent } from './show-computer-of-user-dialog.component';

describe('ShowComputerOfUserDialogComponent', () => {
  let component: ShowComputerOfUserDialogComponent;
  let fixture: ComponentFixture<ShowComputerOfUserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowComputerOfUserDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowComputerOfUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
