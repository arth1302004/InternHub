import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Output() switchToSignup = new EventEmitter<void>();

  email = signal('');
  password = signal('');
  showPassword = signal(false);
  error = signal('');
  isSubmitting = signal(false);

  constructor(private authService: AuthService) {}

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.error.set('');
    this.isSubmitting.set(true);

    try {
      const success = await this.authService.login(this.email(), this.password());
      if (!success) {
        this.error.set('Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      this.error.set('An error occurred. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  handleAdminQuickLogin(): void {
    this.email.set('admin');
    this.password.set('admin@123');
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  onSwitchToSignup(): void {
    this.switchToSignup.emit();
  }

  updateEmail(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.email.set(target.value);
  }

  updatePassword(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.password.set(target.value);
  }
}