import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, query, orderBy, where, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ContactRecord } from '../models/site-config.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private firestore = inject(Firestore);

  saveContact(record: Omit<ContactRecord, 'id'>): Promise<void> {
    const ref = collection(this.firestore, `contacts/${record.userId}/records`);
    return addDoc(ref, record).then(() => { });
  }

  getContacts(userId: string): Observable<ContactRecord[]> {
    const ref = collection(this.firestore, `contacts/${userId}/records`);
    const q = query(ref, orderBy('contactedAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<ContactRecord[]>;
  }

  deleteContact(userId: string, contactId: string): Promise<void> {
    const ref = doc(this.firestore, `contacts/${userId}/records/${contactId}`);
    return deleteDoc(ref);
  }
}