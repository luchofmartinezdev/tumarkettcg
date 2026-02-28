import { inject, Injectable } from '@angular/core';
import {
  Firestore, collection, collectionData,
  addDoc, query, orderBy, where, getDocs
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { SellerRating } from '../models/site-config.model';

@Injectable({ providedIn: 'root' })
export class RatingService {
  private firestore = inject(Firestore);

  getRatings(sellerId: string): Observable<SellerRating[]> {
    const ref = collection(this.firestore, `ratings/${sellerId}/records`);
    const q = query(ref, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<SellerRating[]>;
  }

  async submitRating(sellerId: string, raterId: string, stars: number): Promise<void> {
    const ref = collection(this.firestore, `ratings/${sellerId}/records`);
    await addDoc(ref, { sellerId, raterId, stars, createdAt: new Date() });
  }

  async hasRated(sellerId: string, raterId: string): Promise<boolean> {
    const ref = collection(this.firestore, `ratings/${sellerId}/records`);
    const q = query(ref, where('raterId', '==', raterId));
    const snap = await getDocs(q);
    return !snap.empty;
  }

  async hasContacted(raterId: string, sellerId: string): Promise<boolean> {
    const ref = collection(this.firestore, `contacts/${raterId}/records`);
    const q = query(ref, where('sellerId', '==', sellerId));
    const snap = await getDocs(q);
    return !snap.empty;
  }

  calculateAverage(ratings: SellerRating[]): number {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.stars, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  }
}