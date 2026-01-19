import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensexBarComponent } from './sensex-bar.component';

describe('SensexBarComponent', () => {
  let component: SensexBarComponent;
  let fixture: ComponentFixture<SensexBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SensexBarComponent]
    });
    fixture = TestBed.createComponent(SensexBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
