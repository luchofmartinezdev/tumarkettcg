import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileContacts } from './profile-contacts';

describe('ProfileContacts', () => {
  let component: ProfileContacts;
  let fixture: ComponentFixture<ProfileContacts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileContacts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileContacts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
