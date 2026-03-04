import { DestroyRef, effect, inject, Injectable, signal, Injector } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  where,
  query,
  increment
} from '@angular/fire/firestore';
import { map, Observable, switchMap } from 'rxjs';
import { CardPost } from '../models/site-config.model';
import { AuthService } from './auth';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { CollectionResolverService } from './collection-resolver';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { generateSlug } from '../../shared/utils/slug';

@Injectable({ providedIn: 'root' })
export class CardService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private storage = inject(Storage);
  private resolver = inject(CollectionResolverService);
  private destroyRef = inject(DestroyRef);

  private get postsCollection() {
    return collection(this.firestore, this.resolver.postsCollection());
  }

  private _allPosts = signal<CardPost[]>([]);
  public allPosts = this._allPosts.asReadonly();

  constructor() {
    // Usamos toObservable para reaccionar a cambios en la colección (posts vs posts_test)
    // sin perder el contexto de inyección de Angular
    const collection$ = toObservable(this.resolver.postsCollection, { injector: inject(Injector) });

    collection$.pipe(
      switchMap(collectionName => {
        const activePostsQuery = query(
          collection(this.firestore, collectionName),
          where('active', '==', true)
        );
        return collectionData(activePostsQuery, { idField: 'id' });
      }),
      map((posts: any[]) => posts.map(post => ({
        ...post,
        createdAt: (post['createdAt'] as any)?.toDate() || new Date()
      } as CardPost))),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => this._allPosts.set(data),
      error: (err) => console.error('Error cargando las cartas de TuMarketTCG:', err)
    });
  }

  async createPost(postData: Partial<CardPost>) {
    const currentUser = this.authService.currentUser();
    if (!currentUser) throw new Error('Debes iniciar sesión para publicar una carta.');

    const newPost = {
      ...postData,
      userId: currentUser.uid,
      userName: currentUser.displayName || 'Usuario Anónimo',
      userEmail: currentUser.email,
      createdAt: new Date(),
      active: true,
      views: 0,
      whatsappClicks: 0
    };

    try {
      const docRef = await addDoc(this.postsCollection, newPost);
      const slug = generateSlug(postData.cardName ?? 'carta', docRef.id);
      await updateDoc(docRef, { slug });

      return docRef.id;
    } catch (error) {
      console.error('Error al guardar en Firebase:', error);
      throw error;
    }
  }

  async updatePost(id: string, data: Partial<CardPost>) {
    const docRef = doc(this.firestore, `${this.resolver.postsCollection()}/${id}`);
    return updateDoc(docRef, data);
  }

  async deletePost(id: string, imagePath?: string) {
    if (imagePath) {
      try {
        const imageRef = ref(this.storage, imagePath);
        await deleteObject(imageRef);
      } catch (error) {
        console.warn('No se pudo eliminar la imagen de Storage:', error);
      }
    }

    const docRef = doc(this.firestore, `${this.resolver.postsCollection()}/${id}`);
    return deleteDoc(docRef);
  }

  async toggleStatus(id: string, currentStatus: boolean) {
    const docRef = doc(this.firestore, `${this.resolver.postsCollection()}/${id}`);
    return updateDoc(docRef, { active: !currentStatus });
  }

  getUserPosts(userId: string): Observable<CardPost[]> {
    const userPostsQuery = query(
      this.postsCollection,
      where('userId', '==', userId)
    );
    return collectionData(userPostsQuery, { idField: 'id' }) as Observable<CardPost[]>;
  }

  async uploadImage(file: File): Promise<{ url: string, path: string }> {
    const filePath = `posts/${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const fileRef = ref(this.storage, filePath);

    try {
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      return { url, path: filePath };
    } catch (error) {
      console.error('Error al subir imagen a Storage:', error);
      throw error;
    }
  }

  async markAsSold(id: string, buyerName?: string): Promise<void> {
    const docRef = doc(this.firestore, `${this.resolver.postsCollection()}/${id}`);
    await updateDoc(docRef, {
      isSold: true,
      active: false,
      buyerName: buyerName || null,
      soldAt: new Date()
    });
  }
  async incrementViews(id: string) {
    const docRef = doc(this.firestore, `${this.resolver.postsCollection()}/${id}`);
    return updateDoc(docRef, { views: increment(1) });
  }

  async incrementWhatsappClicks(id: string) {
    const docRef = doc(this.firestore, `${this.resolver.postsCollection()}/${id}`);
    return updateDoc(docRef, { whatsappClicks: increment(1) });
  }
}