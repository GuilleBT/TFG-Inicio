import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { BannedComponent } from './features/banned/banned.component';

export const routes: Routes = [
  {
    path: 'banned',
    component: BannedComponent
  },
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'matching',
    loadComponent: () => import('./features/matching/matching.component').then(m => m.MatchingComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'sessions',
    loadComponent: () => import('./features/sessions/sessions.component').then(m => m.SessionsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reviews',
    loadComponent: () => import('./features/reviews/reviews.component').then(m => m.ReviewsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'minijuegos',
    loadComponent: () => import('./features/minijuegos/minijuegos').then(m => m.Minijuegos),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];