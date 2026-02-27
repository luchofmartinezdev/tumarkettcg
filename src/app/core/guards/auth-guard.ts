import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router'; 
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el Signal del usuario tiene datos, permitimos el paso
  if (authService.currentUser()) {
    return true;
  }

  // Si no está logueado, lo mandamos al login
  // Opcional: podemos guardar 'state.url' para redirigirlo de vuelta después del login
  router.navigate(['/login']);
  return false;
};