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

  public instagram = signal<string>('');
  public twitter = signal<string>('');
  public facebook = signal<string>('');
  public showSocialLinks = signal<boolean>(false);

  // Estados para card de edición
  public isSavingProfile = signal<boolean>(false);
  public savedProfileOk = signal<boolean>(false);

  // Estados para card de privacidad
  public isSavingLocation = signal<boolean>(false);
  public savedLocationOk = signal<boolean>(false);
  public isSavingSocial = signal<boolean>(false);
  public savedSocialOk = signal<boolean>(false);

  async ngOnInit() {
    const user = this.authService.currentUser();
    if (!user) return;
    const profile = await this.userProfileService.getProfile(user.uid);
    if (profile) {
      this.location.set(profile.location ?? '');
      this.showLocation.set(profile.showLocation ?? false);
      this.instagram.set(profile.instagram ?? '');
      this.twitter.set(profile.twitter ?? '');
      this.facebook.set(profile.facebook ?? '');
      this.showSocialLinks.set(profile.showSocialLinks ?? false);
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
      instagram: this.instagram(),
      twitter: this.twitter(),
      facebook: this.facebook(),
    });

    this.isSavingProfile.set(false);
    this.savedProfileOk.set(true);
    setTimeout(() => this.savedProfileOk.set(false), 3000);
  }

  async toggleShowLocation() {
    this.showLocation.set(!this.showLocation());

    const user = this.authService.currentUser();
    if (!user) return;

    this.isSavingLocation.set(true);
    await this.userProfileService.saveProfile(user.uid, {
      showLocation: this.showLocation(),
    });
    this.isSavingLocation.set(false);
    this.savedLocationOk.set(true);
    setTimeout(() => this.savedLocationOk.set(false), 3000);
  }

  async toggleShowSocialLinks() {
    this.showSocialLinks.set(!this.showSocialLinks());

    const user = this.authService.currentUser();
    if (!user) return;

    this.isSavingSocial.set(true);
    await this.userProfileService.saveProfile(user.uid, {
      showSocialLinks: this.showSocialLinks(),
    });
    this.isSavingSocial.set(false);
    this.savedSocialOk.set(true);
    setTimeout(() => this.savedSocialOk.set(false), 3000);
  }

  // Mantenemos savePrivacy por compatibilidad si se usa en otro lado, 
  // pero ya no es el motor principal de los toggles individuales.
  async savePrivacy() {
    const user = this.authService.currentUser();
    if (!user) return;

    await this.userProfileService.saveProfile(user.uid, {
      showLocation: this.showLocation(),
      showSocialLinks: this.showSocialLinks(),
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}