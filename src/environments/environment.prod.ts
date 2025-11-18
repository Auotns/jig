export const environment = {
  production: true,
  version: '1.0.0',
  appName: 'JIG Management System',
  apiUrl: '', // Pre budúce rozšírenie s backendom
  enableDebugLog: false,
  firebase: {
    apiKey: 'AIzaSyBqa7FEJ8nhPhpr6wJjlFTCWgQlskH6pBY',
    authDomain: 'jigmanagement.firebaseapp.com',
    projectId: 'jigmanagement',
    storageBucket: 'jigmanagement.firebasestorage.app',
    messagingSenderId: '676640085832',
    appId: '1:676640085832:web:1a303667b49ff7c808857d'
  }
};

// Note: Firebase API keys are safe to expose in client-side code.
// Security is enforced through Firestore Security Rules and Authentication.
// See: https://firebase.google.com/docs/projects/api-keys
