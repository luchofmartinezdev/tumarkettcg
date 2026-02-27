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
  // Referencia al div donde Google dibujará el botón
  @ViewChild('googleBtn', { static: true }) googleBtn!: ElementRef;

  private authService = inject(AuthService);
  async onGoogleLogin() {
    await this.authService.loginWithGoogle();
  }
  // ngOnInit() {
  //   // 1. Inicializar Google One Tap / Sign In
  //   // Reemplaza 'TU_CLIENT_ID' por el que generaste en Google Cloud Console
  //   (window as any).google.accounts.id.initialize({
  //     client_id: '995600091576-ghs3bk20e256en120pvvbrq35dc3l08d.apps.googleusercontent.com',
  //     callback: (response: any) => this.authService.handleLogin(response)
  //   });

  //   // 2. Renderizar el botón con estilo personalizado
  //   (window as any).google.accounts.id.renderButton(this.googleBtn.nativeElement, {
  //     theme: 'outline',
  //     size: 'large',
  //     text: 'signin_with',
  //     shape: 'pill',
  //     width: 280
  //   });
  // }
}