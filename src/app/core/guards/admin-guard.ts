import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';
import { CollectionResolverService } from '../services/collection-resolver';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const resolver = inject(CollectionResolverService);
  const router = inject(Router);

  const checkAdmin = () => {
    if (resolver.isAdmin()) {
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
