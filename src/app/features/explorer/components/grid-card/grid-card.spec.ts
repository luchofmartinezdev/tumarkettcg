import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCard } from './grid-card';

describe('GridCard', () => {
  let component: GridCard;
  let fixture: ComponentFixture<GridCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
