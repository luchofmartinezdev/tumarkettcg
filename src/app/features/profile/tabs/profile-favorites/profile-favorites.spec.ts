import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFavorites } from './profile-favorites';

describe('ProfileFavorites', () => {
  let component: ProfileFavorites;
  let fixture: ComponentFixture<ProfileFavorites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileFavorites]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileFavorites);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
