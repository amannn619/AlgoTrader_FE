import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTileComponent } from './stock-tile.component';

describe('StockTileComponent', () => {
  let component: StockTileComponent;
  let fixture: ComponentFixture<StockTileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockTileComponent]
    });
    fixture = TestBed.createComponent(StockTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
