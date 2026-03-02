import { inject, Injectable, signal } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, query, orderBy, getDocs, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FavoriteRecord } from '../models/site-config.model';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private firestore = inject(Firestore);

  getFavorites(userId: string): Observable<FavoriteRecord[]> {
    const ref = collection(this.firestore, `favorites/${userId}/records`);
    const q = query(ref, orderBy('savedAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<FavoriteRecord[]>;
  }

  // async addFavorite(record: Omit<FavoriteRecord, 'id'>): Promise<void> {
  //   const ref = collection(this.firestore, `favorites/${record.userId}/records`);
  //   await addDoc(ref, record);
  // }

  async removeFavorite(userId: string, favoriteId: string): Promise<void> {
    const ref = doc(this.firestore, `favorites/${userId}/records/${favoriteId}`);
    await deleteDoc(ref);
  }

  async isFavorite(userId: string, postId: string): Promise<boolean> {
    const ref = collection(this.firestore, `favorites/${userId}/records`);
    const q = query(ref, where('postId', '==', postId));
    const snap = await getDocs(q);
    return !snap.empty;
  }

  // Agregar al FavoriteService existente:

  async getFavoritesSnapshot(userId: string): Promise<FavoriteRecord[]> {
    const ref = collection(this.firestore, `favorites/${userId}/records`);
    const snap = await getDocs(ref);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as FavoriteRecord));
  }

  async addFavorite(userId: string, data: Omit<FavoriteRecord, 'id' | 'userId' | 'savedAt'>): Promise<void> {
    const ref = collection(this.firestore, `favorites/${userId}/records`);
    await addDoc(ref, { ...data, userId, savedAt: new Date() });
  }

  async removeFavoriteByPostId(userId: string, postId: string): Promise<void> {
    const ref = collection(this.firestore, `favorites/${userId}/records`);
    const q = query(ref, where('postId', '==', postId));
    const snap = await getDocs(q);
    snap.forEach(d => deleteDoc(d.ref));
  }
}