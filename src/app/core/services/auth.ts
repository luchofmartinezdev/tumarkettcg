import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signOut, authState, User, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from '@angular/fire/auth';
import { UserProfileService } from './user-profile';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private fireAuth = inject(Auth);
  private userProfileService = inject(UserProfileService);

  // Ahora guarda un User de Firebase de verdad
  public currentUser = signal<User | null>(null);
  public authReady = signal<boolean>(false);
  public isLoading = signal<boolean>(false); // ← Nueva señal para el UI
  private pendingContact: any = null;

  constructor() {
    // Esto es magia reactiva: Firebase nos avisa automáticamente si el usuario entra o sale
    authState(this.fireAuth).subscribe((user) => {
      this.currentUser.set(user);
      this.authReady.set(true);
      if (user) {
        this.userProfileService.ensureProfile(user);
      }
    });

    // Manejar el resultado de la redirección al volver a la app (importante para mobile)
    this.handleRedirect();
  }

  private async handleRedirect() {
    try {
      this.isLoading.set(true);
      const result = await getRedirectResult(this.fireAuth);
      
      if (result?.user) {
        await this.userProfileService.ensureProfile(result.user);
        this.router.navigate(['/']);
      } else {
        // Si entramos aquí es que volvimos de Google pero perdimos la sesión
        // Esto suele pasar por restricciones de cookies en el navegador móvil
        console.log('Redirect result is null');
      }
    } catch (error: any) {
      console.error('Error detallado en redirect:', error);
      alert('Error técnico: ' + error.code + '\n' + error.message);
    } finally {
      this.isLoading.set(false);
    }
  }
  // EL NUEVO LOGIN OFICIAL DE GOOGLE
  async loginWithGoogle() {
    try {
      this.isLoading.set(true);
      const provider = new GoogleAuthProvider();
      
      // Intentamos Popup para todos (es más confiable con IPs locales y HTTP)
      // Los navegadores modernos móviles lo manejan bien si nace de un click.
      const result = await signInWithPopup(this.fireAuth, provider);
      
      if (result.user) {
        await this.userProfileService.ensureProfile(result.user);
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión con Google:', error);
      
      // Fallback a Redirect solo si el Popup es bloqueado
      if (error.code === 'auth/popup-blocked') {
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(this.fireAuth, provider);
      } else if (error.code === 'auth/unauthorized-domain') {
        alert('⛔ TU IP NO ESTÁ AUTORIZADA\n\nDebes agregar 192.168.1.156 en la consola de Firebase > Authentication > Settings > Authorized Domains.');
      } else {
        alert('Error: ' + error.message);
      }
    } finally {
      this.isLoading.set(false);
    }
  }
  // Método clásico de Login
  async login(email: string, pass: string) {
    try {
      const result = await signInWithEmailAndPassword(this.fireAuth, email, pass);
      await this.userProfileService.ensureProfile(result.user);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Credenciales incorrectas o error en Firebase', error);
      throw error;
    }
  }

  async logout() {
    await signOut(this.fireAuth);
    this.router.navigate(['/']);
  }

  setPendingContact(data: {
    phone: string,
    cardName: string,
    type: any,
    price?: number,
    franchise?: string,
    sellerId: string,
    sellerName: string,
    postId: string
  }) {
    this.pendingContact = data;
  }

  getPendingContact() {
    return this.pendingContact;
  }

  clearPendingContact() {
    this.pendingContact = null;
  }
}