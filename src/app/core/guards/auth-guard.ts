import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.authReady()) {
    if (authService.currentUser()) return true;
    router.navigate(['/login']);
    return false;
  }

  return toObservable(authService.authReady).pipe(
    filter(ready => ready),
    take(1),
    map(() => {
      if (authService.currentUser()) return true;
      router.navigate(['/login']);
      return false;
    })
  );
};