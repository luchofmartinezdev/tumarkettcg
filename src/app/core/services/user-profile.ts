import { inject, Injectable } from '@angular/core';
import {
  Firestore, collection, doc, getDoc, getDocs, query, setDoc, updateDoc,
  where
} from '@angular/fire/firestore';
import { UserProfile } from '../models/site-config.model';
import { generateSlug } from '../../shared/utils/slug';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private firestore = inject(Firestore);

  async getProfile(uid: string): Promise<UserProfile | null> {
    const ref = doc(this.firestore, `users/${uid}`);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as UserProfile) : null;
  }

  async saveProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const ref = doc(this.firestore, `users/${uid}`);
    const snap = await getDoc(ref);

    // Generamos el slug con el nombre del usuario
    const slug = generateSlug(data.displayName || uid, uid);

    if (snap.exists()) {
      await updateDoc(ref, { ...data, slug });
    } else {
      await setDoc(ref, { uid, totalSales: 0, slug, ...data });
    }
  }

  async getProfileBySlug(slug: string): Promise<UserProfile | null> {
    const ref = collection(this.firestore, 'users');
    const q = query(ref, where('slug', '==', slug));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as UserProfile;
  }
}