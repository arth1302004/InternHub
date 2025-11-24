import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { InternGuard } from './guards/intern.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./components/auth-wrapper/auth-wrapper.component').then(m => m.AuthWrapperComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/intern/:id',
    loadComponent: () => import('./components/intern-profile/intern-profile.component').then(m => m.InternProfileComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'intern',
    loadComponent: () => import('./components/intern-dashboard/intern-dashboard.component').then(m => m.InternDashboardComponent),
    canActivate: [AuthGuard, InternGuard]
  },
  {
    path: '**',
    redirectTo: '/auth'
  }
];