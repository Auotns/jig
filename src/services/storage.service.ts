import { Injectable } from '@angular/core';
import { Jig } from '../models/jig.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly JIGS_KEY = 'jig_management_jigs';
  private readonly USER_KEY = 'jig_management_user';
  private readonly LANGUAGE_KEY = 'jig_management_language';

  // JIG Operations
  saveJigs(jigs: Jig[]): void {
    try {
      localStorage.setItem(this.JIGS_KEY, JSON.stringify(jigs));
    } catch (error) {
      console.error('Error saving jigs to localStorage:', error);
    }
  }

  loadJigs(): Jig[] | null {
    try {
      const data = localStorage.getItem(this.JIGS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading jigs from localStorage:', error);
      return null;
    }
  }

  clearJigs(): void {
    localStorage.removeItem(this.JIGS_KEY);
  }

  // User/Auth Operations
  saveUser(user: User): void {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }

  loadUser(): User | null {
    try {
      const data = localStorage.getItem(this.USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
      return null;
    }
  }

  clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // Language Operations
  saveLanguage(lang: string): void {
    try {
      localStorage.setItem(this.LANGUAGE_KEY, lang);
    } catch (error) {
      console.error('Error saving language to localStorage:', error);
    }
  }

  loadLanguage(): string | null {
    try {
      return localStorage.getItem(this.LANGUAGE_KEY);
    } catch (error) {
      console.error('Error loading language from localStorage:', error);
      return null;
    }
  }

  // Clear all app data
  clearAll(): void {
    this.clearJigs();
    this.clearUser();
  }
}
