import { inject, Injectable } from '@angular/core';
import {
  Firestore, collection, doc, getDoc, getDocs, query, setDoc, updateDoc,
  where, getDocFromServer
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

  async ensureProfile(user: any): Promise<void> {
    const ref = doc(this.firestore, `users/${user.uid}`);
    const snap = await getDocFromServer(ref);

    if (!snap.exists()) {
      const slug = generateSlug(user.displayName || 'usuario', user.uid);
      const initialProfile: UserProfile = {
        uid: user.uid,
        displayName: user.displayName || 'Usuario Anónimo',
        photoURL: user.photoURL || '',
        slug,
        location: '',
        showLocation: false,
        instagram: '',
        twitter: '',
        facebook: '',
        showSocialLinks: false,
        totalSales: 0,
        createdAt: new Date()
      };
      await setDoc(ref, initialProfile);
    }
  }

  async saveProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const ref = doc(this.firestore, `users/${uid}`);

    if (data.displayName) {
      data.slug = generateSlug(data.displayName, uid);
    }

    try {
      await setDoc(ref, data, { merge: true });
    } catch (e: any) {
      console.error('error completo:', e.code, e.message);
      throw e;
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