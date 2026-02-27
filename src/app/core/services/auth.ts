import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signOut, authState, User, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private fireAuth = inject(Auth);

  // Ahora guarda un User de Firebase de verdad
  public currentUser = signal<User | null>(null);
  private pendingContact: any = null;

  constructor() {
    // Esto es magia reactiva: Firebase nos avisa automáticamente si el usuario entra o sale
    authState(this.fireAuth).subscribe((user) => {
      this.currentUser.set(user);
    });
  }
// EL NUEVO LOGIN OFICIAL DE GOOGLE
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      // Esto abre la ventanita clásica de "Elegir cuenta de Google"
      await signInWithPopup(this.fireAuth, provider);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  }
  // Método clásico de Login
  async login(email: string, pass: string) {
    try {
      await signInWithEmailAndPassword(this.fireAuth, email, pass);
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

  setPendingContact(data: { phone: string, cardName: string, type: string }) {
    this.pendingContact = data;
  }

  getPendingContact() {
    return this.pendingContact;
  }

  clearPendingContact() {
    this.pendingContact = null;
  }
}