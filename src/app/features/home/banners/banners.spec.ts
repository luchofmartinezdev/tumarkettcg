import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBanners } from './banners';

describe('HomeBanners', () => {
  let component: HomeBanners;
  let fixture: ComponentFixture<HomeBanners>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeBanners]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomeBanners);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
