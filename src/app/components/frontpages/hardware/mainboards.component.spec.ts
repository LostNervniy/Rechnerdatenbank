import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainboardsComponent } from './mainboards.component';

describe('MainboardsComponent', () => {
  let component: MainboardsComponent;
  let fixture: ComponentFixture<MainboardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainboardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
