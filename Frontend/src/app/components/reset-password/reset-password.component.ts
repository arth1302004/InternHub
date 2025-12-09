import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { combineLatest } from 'rxjs';
import { InternService } from '../../service/intern.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { JSEncrypt } from 'jsencrypt';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  internId: string | null = null;
  resetToken: string | null = null;
  passwordStrength: 'weak' | 'medium' | 'strong' | '' = '';

  router = inject(Router);
  fb = inject(FormBuilder);
  internService = inject(InternService);
  route = inject(ActivatedRoute);
  http = inject(HttpClient); // Inject HttpClient
  publickey: string = '';
  private baseUrl = 'http://localhost:5101'; // Adjust if your backend URL is different

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    // Use combineLatest to wait for both paramMap and queryParamMap to emit
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(([paramMap, queryParamMap]) => {
      this.internId = paramMap.get('id');
      this.resetToken = queryParamMap.get('token');

      if (!this.internId && !this.resetToken) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Invalid request. No user ID or token found.',
        }).then(() => {
          this.router.navigate(['/login']);
        });
      }
    });

    this.resetPasswordForm.get('newPassword')?.valueChanges.subscribe((password: string) => {
      this.checkPasswordStrength(password);
    });
    this.getPublicKey(); // Fetch public key on init
  }

  getPublicKey(): void {
    this.http.get(`${this.baseUrl}/api/Login/public-key`, { responseType: 'text' }).subscribe({
      next: (key) => {
        this.publickey = key; // Decode base64
        console.log('Public Key fetched:', this.publickey);
      },
      error: (err) => {
        console.error('Error fetching public key:', err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to load public key. Cannot proceed with password reset.',
        });
      }
    });
  }

  checkPasswordStrength(password: string) {
    const weakRegex = /.{6,}/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{12,}$/;

    if (strongRegex.test(password)) {
      this.passwordStrength = 'strong';
    } else if (mediumRegex.test(password)) {
      this.passwordStrength = 'medium';
    } else if (weakRegex.test(password)) {
      this.passwordStrength = 'weak';
    } else {
      this.passwordStrength = '';
    }
  }

  resetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill all the required fields and ensure passwords match!',
      });
      return;
    }

    if (!this.publickey) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Public key not loaded. Cannot proceed with password reset.',
      });
      return;
    }

    const newPassword = this.resetPasswordForm.get('newPassword')?.value;
    const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value;

    console.log('New password before encryption:', newPassword);
    console.log('Confirm password before encryption:', confirmPassword);

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'New password and confirm password do not match!',
      });
      return;
    }

    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(this.publickey);

    const encryptedNewPassword = encrypt.encrypt(newPassword);
    const encryptedConfirmPassword = encrypt.encrypt(confirmPassword);

    if (!encryptedNewPassword || !encryptedConfirmPassword) {
      console.error('Encryption failed: encryptedNewPassword or encryptedConfirmPassword is null or empty.');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to encrypt passwords.',
      });
      return;
    }
    console.log('Encrypted new password:', encryptedNewPassword);
    console.log('Encrypted confirm password:', encryptedConfirmPassword);

    const resetData = { password: encryptedNewPassword, confirmPassword: encryptedConfirmPassword };

    if (this.resetToken) {
      this.internService.resetPasswordWithToken(this.resetToken, resetData).subscribe({
        next: (response: string) => {
          Swal.fire({
            icon: 'success',
            title: 'Password Reset!',
            text: 'Your password has been successfully reset.',
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (error: any) => {
          console.error('Password reset failed', error);
          let errorMessage = 'Something went wrong! Please try again.';
          if (error.status === 400 && error.error) {
            errorMessage = error.error;
          }
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: errorMessage,
          });
        },
      });
    } else if (this.internId) {
      this.internService.resetPassword(this.internId, resetData).subscribe({
        next: (response: string) => {
          if (response === 'successfully reseted the password.') {
            Swal.fire({
              icon: 'success',
              title: 'Password Reset!',
              text: 'Your password has been successfully reset.',
            }).then(() => {
              this.router.navigate(['/profile']);
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: response || 'Failed to reset password. Please try again.',
            });
          }
        },
        error: (error: any) => {
          console.error('Password reset failed', error);
          let errorMessage = 'Something went wrong! Please try again.';
          if (error.status === 400 && error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: errorMessage,
          });
        },
      });
    }
  }

  RedirectToLogin() {
    this.router.navigate(['/login'])
  }

  cancelReset(): void {
    if (this.resetToken) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/attendances']);
    }
  }

  tryAnotherWay(): void {
    if (this.internId) {
      // If internId is already available (from route param, e.g., after verify-password)
      this.router.navigate(['/answer-security-questions', this.internId]);
    } else if (this.resetToken) {
      // If only resetToken is available (from query param, e.g., forgot password link)
      // Fetch userId from token first
      this.internService.getUserIdFromResetToken(this.resetToken).subscribe({
        next: (response: any) => {
          if (response && response.userId) {
            this.router.navigate(['/answer-security-questions', response.userId]);
          } else {
            Swal.fire('Error', 'Could not retrieve user ID from token.', 'error');
          }
        },
        error: (err) => {
          console.error('Error fetching userId from token:', err);
          Swal.fire('Error', 'Failed to verify token or retrieve user ID.', 'error');
        }
      });
    } else {
      // Neither internId nor resetToken is available
      Swal.fire('Error', 'Cannot proceed without user ID or reset token.', 'error');
      this.router.navigate(['/login']);
    }
  }
}
