import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllActionsComponent } from './all-actions.component';

describe('AllActionsComponent', () => {
  let component: AllActionsComponent;
  let fixture: ComponentFixture<AllActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllActionsComponent]
    });
    fixture = TestBed.createComponent(AllActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
