import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InternService } from '../../service/intern.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotPasswordForm!: FormGroup;

  router = inject(Router);
  fb = inject(FormBuilder);
  internService = inject(InternService);

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendResetLink(): void {
    if (this.forgotPasswordForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter a valid email address!',
      });
      return;
    }

    const email = this.forgotPasswordForm.get('email')?.value;
    console.log('Sending forgot password request for email:', email);
    this.internService.forgotPassword(email).subscribe({
      next: (response: any) => {
        console.log('Forgot password response:', response);
        if (response && response.internId) {
          console.log('Navigating to answer-security-questions with internId:', response.internId);
          this.router.navigate(['/answer-security-questions'], { queryParams: { internId: response.internId } });
        } else {
          console.error('Forgot password response did not contain internId:', response);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Could not retrieve user information.',
          });
        }
      },
      error: (error: any) => {
        console.error('Forgot password API call failed:', error);
        let errorMessage = 'Something went wrong! Please try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (typeof error.error === 'string') {
          errorMessage = error.error;
        }
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/login']);
  }
}