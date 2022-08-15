import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaeumeComponent } from './raeume.component';

describe('RaeumeComponent', () => {
  let component: RaeumeComponent;
  let fixture: ComponentFixture<RaeumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaeumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaeumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
