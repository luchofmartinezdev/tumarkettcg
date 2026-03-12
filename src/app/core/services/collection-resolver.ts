import { inject, Injectable, computed } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { AuthService } from './auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CollectionResolverService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  // Escucha en tiempo real el array de emails desde Firestore
  private testEmails = toSignal(
    docData(doc(this.firestore, 'config/test_users')).pipe(
      map((data: any) => (data?.emails ?? []) as string[])
    ),
    { initialValue: [] as string[] }
  );

  // Escucha en tiempo real el array de admins desde Firestore
  public adminEmails = toSignal(
    docData(doc(this.firestore, 'config/admins')).pipe(
      map((data: any) => (data?.emails ?? []) as string[])
    ),
    { initialValue: [] as string[] }
  );

  public postsCollection = computed(() => {
    const email = this.authService.currentUser()?.email?.toLowerCase() ?? '';
    return this.testEmails().includes(email) ? 'posts_test' : 'posts';
  });

  public isAdmin = computed(() => {
    const email = this.authService.currentUser()?.email?.toLowerCase() ?? '';
    return this.adminEmails().includes(email);
  });
}