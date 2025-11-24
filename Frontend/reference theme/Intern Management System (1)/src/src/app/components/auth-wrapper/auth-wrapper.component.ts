import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-auth-wrapper',
  standalone: true,
  imports: [CommonModule, LoginComponent, SignupComponent],
  template: `
    @if (authService.loading$ | async) {
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg class="w-4 h-4 text-primary-foreground animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <p class="text-muted-foreground">Loading...</p>
        </div>
      </div>
    } @else if (!authService.user()) {
      @if (authMode() === 'login') {
        <app-login (switchToSignup)="authMode.set('signup')"></app-login>
      } @else {
        <app-signup (switchToLogin)="authMode.set('login')"></app-signup>
      }
    }
  `,
  styleUrl: './auth-wrapper.component.scss'
})
export class AuthWrapperComponent {
  authMode = signal<'login' | 'signup'>('login');

  constructor(public authService: AuthService) {}
}