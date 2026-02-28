import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Explorer } from './catalog';

describe('Explorer', () => {
  let component: Explorer;
  let fixture: ComponentFixture<Explorer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Explorer]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Explorer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
