import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

// Imports oficiales de AngularFire para versiones modernas
import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    // Detección de cambios estándar (requerida por Firebase)
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Configuración de rutas que ya tenías
    provideRouter(
      routes, 
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }), 
      withComponentInputBinding()
    ),

    // Inicialización nativa Standalone de Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore(getApp(), 'tumarkettcg')),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
  ]
};