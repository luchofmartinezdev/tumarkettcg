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
  public isSaving = signal<boolean>(false);
  public savedOk = signal<boolean>(false);

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

    this.isSaving.set(true);
    this.savedOk.set(false);

    await this.userProfileService.saveProfile(user.uid, {
      displayName: user.displayName ?? '',
      photoURL: user.photoURL ?? '',
      location: this.location(),
      showLocation: this.showLocation(),
    });

    this.isSaving.set(false);
    this.savedOk.set(true);
    setTimeout(() => this.savedOk.set(false), 3000);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}