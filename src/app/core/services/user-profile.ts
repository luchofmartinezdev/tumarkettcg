import { inject, Injectable } from '@angular/core';
import {
  Firestore, doc, getDoc, setDoc, updateDoc
} from '@angular/fire/firestore';
import { UserProfile } from '../models/site-config.model';

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
    if (snap.exists()) {
      await updateDoc(ref, { ...data });
    } else {
      await setDoc(ref, { uid, totalSales: 0, ...data });
    }
  }
}