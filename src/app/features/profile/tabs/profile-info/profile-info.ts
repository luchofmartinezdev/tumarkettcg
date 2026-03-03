import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';
import { UserProfileService } from '../../../../core/services/user-profile';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-info.html'
})
export class ProfileInfoComponent implements OnInit {
  public authService = inject(AuthService);
  private userProfileService = inject(UserProfileService);
  private router = inject(Router);

  public location = signal<string>('');
  public showLocation = signal<boolean>(false);

  // Estados para card de edición
  public isSavingProfile = signal<boolean>(false);
  public savedProfileOk = signal<boolean>(false);

  // Estados para card de privacidad
  public isSavingPrivacy = signal<boolean>(false);
  public savedPrivacyOk = signal<boolean>(false);

  async ngOnInit() {
    const user = this.authService.currentUser();
    if (!user) return;
    const profile = await this.userProfileService.getProfile(user.uid);
    if (profile) {
      this.location.set(profile.location ?? '');
      this.showLocation.set(profile.showLocation ?? false);
    }
  }

  async saveProfile() {
    const user = this.authService.currentUser();
    if (!user) return;

    this.isSavingProfile.set(true);
    this.savedProfileOk.set(false);

    await this.userProfileService.saveProfile(user.uid, {
      displayName: user.displayName ?? '',
      photoURL: user.photoURL ?? '',
      location: this.location(),
    });

    this.isSavingProfile.set(false);
    this.savedProfileOk.set(true);
    setTimeout(() => this.savedProfileOk.set(false), 3000);
  }

  async toggleShowLocation() {
    this.showLocation.set(!this.showLocation());
    await this.savePrivacy();
  }

  async savePrivacy() {
    const user = this.authService.currentUser();
    if (!user) return;

    this.isSavingPrivacy.set(true);
    this.savedPrivacyOk.set(false);

    await this.userProfileService.saveProfile(user.uid, {
      displayName: user.displayName ?? '',
      photoURL: user.photoURL ?? '',
      showLocation: this.showLocation(),
    });

    this.isSavingPrivacy.set(false);
    this.savedPrivacyOk.set(true);
    setTimeout(() => this.savedPrivacyOk.set(false), 3000);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}