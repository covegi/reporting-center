import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'moxyid-f78c8',
          appId: '1:290104993359:web:25ec45e9a758194f1b2c3a',
          storageBucket: 'moxyid-f78c8.appspot.com',
          apiKey: 'AIzaSyClBiIXkWqUZCMBQa-8oRDU3YZArFkRPyQ',
          authDomain: 'moxyid-f78c8.firebaseapp.com',
          messagingSenderId: '290104993359',
          measurementId: 'G-NN5TCF1H07',
        }),
      ),
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideFunctions(() => getFunctions())),
    importProvidersFrom(provideStorage(() => getStorage())),
  ],
};
