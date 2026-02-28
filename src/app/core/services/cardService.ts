import { inject, Injectable, signal } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  deleteDoc,
  CollectionReference,
  updateDoc,
  where,
  query
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { CardPost } from '../models/site-config.model';
import { AuthService } from './auth';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  private storage = inject(Storage);

  // Referencia a la colección 'posts' en tu base de datos
  private postsCollection = collection(this.firestore, 'posts');

  private _allPosts = signal<CardPost[]>([]);
  public allPosts = this._allPosts.asReadonly();

  constructor() {
    // 1. Armamos la consulta: Solo cartas activas
    // Opcional: Podés sumar orderBy('createdAt', 'desc') para mostrar las más nuevas arriba
    const activePostsQuery = query(
      this.postsCollection,
      where('active', '==', true)
    );

    // 2. Escuchamos esa consulta en lugar de la colección completa
    // collectionData(activePostsQuery, { idField: 'id' }).subscribe({
    //   next: (data) => {
    //     // Casteamos la data para que TypeScript sepa que son CardPosts
    //     this._allPosts.set(data as CardPost[]);
    //   },
    //   error: (err) => console.error('Error cargando las cartas de TuMarketTCG:', err)
    // });

    collectionData(activePostsQuery, { idField: 'id' }).pipe(
      map(posts => posts.map(post => ({
        ...post,
        // Convertimos el Timestamp de Firebase a un Date de JS real
        createdAt: (post['createdAt'] as any)?.toDate()   || new Date() 
      } as CardPost)))
    ).subscribe({
      next: (data) => {
        // Casteamos la data para que TypeScript sepa que son CardPosts
        this._allPosts.set(data as CardPost[]);
      },
      error: (err) => console.error('Error cargando las cartas de TuMarketTCG:', err)
    });
  }

  async createPost(postData: Partial<CardPost>) {
    // 1. Obtenemos el usuario logueado en este momento
    const currentUser = this.authService.currentUser();

    // 2. Validación de seguridad (por si alguien llega acá sin loguearse)
    if (!currentUser) {
      throw new Error('Debes iniciar sesión para publicar una carta.');
    }

    // 3. Armamos el objeto final, inyectando los datos que faltan
    const newPost = {
      ...postData,
      userId: currentUser.uid,          // Atamos la carta al ID de Google
      userName: currentUser.displayName || 'Usuario Anónimo', // Guardamos el nombre
      createdAt: new Date(),            // Fecha de publicación
      active: true                      // Por defecto, nace activa
    };

    // 4. Guardamos en Firebase usando addDoc (crea un ID aleatorio)
    try {
      const docRef = await addDoc(this.postsCollection, newPost);
      return docRef.id; // Devolvemos el ID de Firestore por si lo necesitás
    } catch (error) {
      console.error('Error al guardar en Firebase:', error);
      throw error;
    }
  }

  // MÉTODO PARA EDITAR
  async updatePost(id: string, data: Partial<CardPost>) {
    // Creamos una referencia al documento específico usando su ID
    const docRef = doc(this.firestore, `posts/${id}`);

    // Actualizamos solo los campos que cambiaron
    return updateDoc(docRef, data);
  }

  async deletePost(id: string) {
    const docRef = doc(this.firestore, `posts/${id}`);
    return deleteDoc(docRef);
  }

  async toggleStatus(id: string, currentStatus: boolean) {
    // 1. Apuntamos a la carta específica
    const docRef = doc(this.firestore, `posts/${id}`);

    // 2. Mandamos a actualizar SOLO el campo 'active' con el valor invertido
    return updateDoc(docRef, {
      active: !currentStatus
    });
  }

  // Devuelve un Observable con las cartas de un usuario específico
  getUserPosts(userId: string): Observable<CardPost[]> {
    // 1. Armamos la consulta: Buscar en la colección 'posts'
    // donde el campo 'userId' sea igual al ID que le pasamos
    const userPostsQuery = query(
      this.postsCollection,
      where('userId', '==', userId)
    );

    // 2. Ejecutamos la consulta y devolvemos el flujo de datos
    // El { idField: 'id' } es clave para que Firebase nos inyecte el ID del documento
    // y después podamos usarlo para editar o borrar la carta
    return collectionData(userPostsQuery, { idField: 'id' }) as Observable<CardPost[]>;
  }

  async uploadImage(file: File): Promise<{ url: string, path: string }> {
    // 1. Creamos un nombre único para el archivo (usando el tiempo y un ID aleatorio)
    const filePath = `posts/${Date.now()}_${Math.random().toString(36).substring(2)}`;
    const fileRef = ref(this.storage, filePath);

    try {
      // 2. Subimos los bytes del archivo
      await uploadBytes(fileRef, file);

      // 3. Obtenemos la URL de descarga
      const url = await getDownloadURL(fileRef);

      return { url, path: filePath };
    } catch (error) {
      console.error('Error al subir imagen a Storage:', error);
      throw error;
    }
  }
}