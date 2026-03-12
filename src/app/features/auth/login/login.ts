import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  @ViewChild('googleBtn', { static: true }) googleBtn!: ElementRef;

  public authService = inject(AuthService);
  async onGoogleLogin() {
    await this.authService.loginWithGoogle();
  }
}