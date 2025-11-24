import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SignupData } from '../../models/user.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  @Output() switchToLogin = new EventEmitter<void>();

  formData = signal({
    name: '',
    email: '',
    phone: '',
    university: '',
    major: '',
    graduationDate: '',
    skills: '',
    password: '',
    confirmPassword: ''
  });

  showPassword = signal(false);
  showConfirmPassword = signal(false);
  error = signal('');
  success = signal(false);
  isSubmitting = signal(false);

  constructor(private authService: AuthService) {}

  updateFormData(field: string, value: string): void {
    this.formData.update(data => ({
      ...data,
      [field]: value
    }));
  }

  validateForm(): string | null {
    const data = this.formData();
    
    if (!data.name.trim()) return 'Full name is required';
    if (!data.email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(data.email)) return 'Please enter a valid email';
    if (!data.phone.trim()) return 'Phone number is required';
    if (!data.university.trim()) return 'University/College is required';
    if (!data.major.trim()) return 'Major/Field of study is required';
    if (!data.graduationDate) return 'Expected graduation date is required';
    if (!data.password) return 'Password is required';
    if (data.password.length < 6) return 'Password must be at least 6 characters';
    if (data.password !== data.confirmPassword) return 'Passwords do not match';
    
    return null;
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.error.set('');
    this.success.set(false);

    const validationError = this.validateForm();
    if (validationError) {
      this.error.set(validationError);
      return;
    }

    this.isSubmitting.set(true);

    try {
      const data = this.formData();
      const skillsArray = data.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      
      const signupData: SignupData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        university: data.university,
        major: data.major,
        graduationDate: data.graduationDate,
        skills: skillsArray
      };

      const success = await this.authService.signup(signupData);

      if (success) {
        this.success.set(true);
        // Reset form
        this.formData.set({
          name: '',
          email: '',
          phone: '',
          university: '',
          major: '',
          graduationDate: '',
          skills: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        this.error.set('Email already exists. Please use a different email or sign in.');
      }
    } catch (err) {
      this.error.set('An error occurred during signup. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  onSwitchToLogin(): void {
    this.switchToLogin.emit();
  }
}