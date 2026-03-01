import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensexHistoryComponent } from './sensex-history.component';

describe('SensexHistoryComponent', () => {
  let component: SensexHistoryComponent;
  let fixture: ComponentFixture<SensexHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SensexHistoryComponent]
    });
    fixture = TestBed.createComponent(SensexHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
