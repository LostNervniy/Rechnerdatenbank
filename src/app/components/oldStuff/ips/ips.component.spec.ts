import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IPSComponent } from './ips.component';

describe('IPSComponent', () => {
  let component: IPSComponent;
  let fixture: ComponentFixture<IPSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IPSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IPSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
