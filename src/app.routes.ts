import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map } from 'rxjs/operators';

// Auth Guard function
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated() ? true : router.createUrlTree(['/login']);
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/inventory',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'inventory',
    canActivate: [authGuard],
    loadComponent: () => import('./app.component').then(m => m.AppComponent)
  },
  {
    path: 'jig/new',
    canActivate: [authGuard],
    loadComponent: () => import('./app.component').then(m => m.AppComponent)
  },
  {
    path: 'jig/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./app.component').then(m => m.AppComponent)
  },
  {
    path: 'jig/:id/maintenance',
    canActivate: [authGuard],
    loadComponent: () => import('./app.component').then(m => m.AppComponent)
  },
  {
    path: '**',
    redirectTo: '/inventory'
  }
];
