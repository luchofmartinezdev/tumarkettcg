import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

const ADMIN_EMAILS = [
  'luchofmartinez.dev@gmail.com',
  'kernelstudio.solutions@gmail.com'
];

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const checkAdmin = () => {
    const user = authService.currentUser();
    if (user && user.email && ADMIN_EMAILS.includes(user.email)) {
      return true;
    }
    router.navigate(['/']);
    return false;
  };

  if (authService.authReady()) {
    return checkAdmin();
  }

  return toObservable(authService.authReady).pipe(
    filter(ready => ready),
    take(1),
    map(() => checkAdmin())
  );
};
