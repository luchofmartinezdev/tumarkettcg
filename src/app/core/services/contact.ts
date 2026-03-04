import { inject, Injectable, Injector } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, query, orderBy, updateDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CardPost, ContactRecord, TradeType } from '../models/site-config.model';
import { AuthService } from './auth';
import { ToastService } from './toast';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';

import { CardService } from './cardService';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private cardService = inject(CardService);
  private router = inject(Router);

  /**
   * Método principal de contacto.
   * Maneja el login si no está autenticado y guarda el historial si lo está.
   */
  public handleContact(post: CardPost) {
    const user = this.authService.currentUser();

    if (user && user.uid === post.userId) {
      this.toastService.error('No podés contactarte con vos mismo.');
      return;
    }

    if (user) {
      // 1. Guardamos registro en el historial (Lead)
      this.saveContact({
        userId: user.uid,
        sellerId: post.userId,
        sellerName: post.userName,
        postId: post.id,
        cardName: post.cardName,
        franchise: post.franchise,
        price: post.price,
        whatsappContact: post.whatsappContact,
        type: post.type,
        contactedAt: new Date(),
        wasContacted: false
      });

      // 2. Disparamos WhatsApp e incrementamos contador
      this.cardService.incrementWhatsappClicks(post.id);
      this.openWhatsApp(post);
    } else {
      // 3. Si no hay login, guardamos todo para después
      this.authService.setPendingContact({
        phone: post.whatsappContact,
        cardName: post.cardName,
        type: post.type,
        price: post.price,
        franchise: post.franchise,
        sellerId: post.userId,
        sellerName: post.userName,
        postId: post.id
      });
      this.router.navigate(['/login']);
    }
  }

  /**
   * Verifica si hay contactos pendientes al iniciar sesión
   */
  public checkPendingContact() {
    const pending = this.authService.getPendingContact();
    const user = this.authService.currentUser();

    if (pending && user) {
      // Guardamos en historial
      this.saveContact({
        userId: user.uid,
        sellerId: pending.sellerId,
        sellerName: pending.sellerName,
        postId: pending.postId,
        cardName: pending.cardName,
        franchise: pending.franchise,
        price: pending.price,
        whatsappContact: pending.phone,
        type: pending.type,
        contactedAt: new Date(),
        wasContacted: false
      });

      // Disparamos WhatsApp e incrementamos contador
      this.cardService.incrementWhatsappClicks(pending.postId);
      this.openWhatsApp({
        whatsappContact: pending.phone,
        cardName: pending.cardName,
        type: pending.type
      } as CardPost);

      // Limpiamos
      this.authService.clearPendingContact();
    }
  }

  private openWhatsApp(post: CardPost) {
    const message = post.type === TradeType.VENDO
      ? `Hola! Vi tu publicación en TuMarketTCG y me interesa comprar la carta: ${post.cardName}`
      : `Hola! Vi que estás buscando la carta ${post.cardName} en TuMarketTCG y yo la tengo disponible.`;

    window.open(`https://wa.me/${post.whatsappContact}?text=${encodeURIComponent(message)}`, '_blank');
  }

  saveContact(record: Omit<ContactRecord, 'id'>): Promise<void> {
    const ref = collection(this.firestore, `contacts/${record.userId}/records`);
    return addDoc(ref, record).then(() => { });
  }

  getContacts(userId: string): Observable<ContactRecord[]> {
    const ref = collection(this.firestore, `contacts/${userId}/records`);
    return collectionData(ref, { idField: 'id' }) as Observable<ContactRecord[]>;
  }

  deleteContact(userId: string, contactId: string): Promise<void> {
    const ref = doc(this.firestore, `contacts/${userId}/records/${contactId}`);
    return deleteDoc(ref);
  }

  toggleContactedStatus(userId: string, contactId: string, currentStatus: boolean): Promise<void> {
    const ref = doc(this.firestore, `contacts/${userId}/records/${contactId}`);
    return updateDoc(ref, { wasContacted: !currentStatus });
  }
}