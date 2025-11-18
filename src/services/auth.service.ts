import { Injectable, signal, computed, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user, User as FirebaseUser, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { from, Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  
  // Firebase user observable
  user$ = user(this.auth);

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());
  userRole = computed(() => this.currentUser()?.role);

  constructor() {
    // Subscribe to Firebase auth state changes
    this.user$.subscribe(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Load user profile from Firestore
        const userDoc = await getDoc(doc(this.firestore, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.currentUser.set({
            username: userData['username'] || firebaseUser.email?.split('@')[0] || 'user',
            role: userData['role'] as 'Administrator' | 'User' || 'User'
          });
        } else {
          // Fallback if user document doesn't exist
          this.currentUser.set({
            username: firebaseUser.email?.split('@')[0] || 'user',
            role: 'User'
          });
        }
      } else {
        this.currentUser.set(null);
      }
    });
  }

  login(email: string, password: string): Observable<boolean> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Login error:', error);
        return of(false);
      })
    );
  }

  // Helper method for registration (for initial setup)
  register(email: string, password: string, role: 'Administrator' | 'User' = 'User'): Observable<boolean> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(async (credential) => {
        // Create user document in Firestore
        await setDoc(doc(this.firestore, 'users', credential.user.uid), {
          email: email,
          username: email.split('@')[0],
          role: role,
          createdAt: new Date().toISOString()
        });
        return true;
      }),
      catchError((error) => {
        console.error('Registration error:', error);
        return of(false);
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  // Get current Firebase user's ID token (JWT)
  async getIdToken(): Promise<string | null> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      return await currentUser.getIdToken();
    }
    return null;
  }
}
