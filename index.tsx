
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { AppComponent } from './src/app.component';
import { routes } from './src/app.routes';
import { environment } from './src/environments/environment';

console.log('Initializing app with Firebase config:', environment.firebase);

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideFirebaseApp(() => {
      console.log('Initializing Firebase...');
      return initializeApp(environment.firebase);
    }),
    provideAuth(() => {
      console.log('Initializing Auth...');
      return getAuth();
    }),
    provideFirestore(() => {
      console.log('Initializing Firestore...');
      return getFirestore();
    })
  ],
}).then(() => {
  console.log('App bootstrapped successfully');
}).catch((err) => {
  console.error('Bootstrap error:', err);
  document.body.innerHTML = '<pre style="color:red;padding:20px;">ERROR: ' + err.message + '</pre>';
});

// AI Studio always uses an `index.tsx` file for all project types.
