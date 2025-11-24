import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InternService } from '../../service/intern.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup implements OnInit, OnDestroy {
  signUpForm!: FormGroup;
  otpForm!: FormGroup;
  selectedFile: File | null = null;
  isInCorrectForm: boolean = false;
  previewUrl: string | ArrayBuffer | null = null;
  showOtpSection: boolean = false;
  isSendingOtp: boolean = false;
  isVerifyingOtp: boolean = false;
  isSigningUp: boolean = false;

  private ngUnsubscribe = new Subject<void>();

  router = inject(Router);
  fb = inject(FormBuilder);
  internService = inject(InternService);
  cd = inject(ChangeDetectorRef);
  private http = inject(HttpClient); // Inject HttpClient

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      emailAddress: ['', [Validators.required, Validators.email]],
      profilePic: [], // for file
    });

    this.otpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    });

    this.signUpForm.reset();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  sendOtp() {
    const email = this.signUpForm.get('emailAddress')?.value;
    if (!email || this.signUpForm.get('emailAddress')?.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter a valid email address!',
      });
      return;
    }

    this.isSendingOtp = true;
    this.internService.sendOtp(email)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (response: any) => {
        this.isSendingOtp = false;
        if (response.message === 'OTP sent successfully') {
          this.showOtpSection = true;
          this.otpForm.get('email')?.setValue(email);
          this.signUpForm.get('emailAddress')?.disable(); // Disable email after sending OTP
          Swal.fire({
            icon: 'success',
            title: 'OTP Sent!',
            text: 'A 4-digit OTP has been sent to your email address.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: response.message || 'Failed to send OTP. Please try again.',
          });
        }
      },
      error: (error: any) => {
        this.isSendingOtp = false;
        console.error('Send OTP failed', error);
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

  validateOtp() {
    const email = this.otpForm.get('email')?.value;
    const otp = this.otpForm.get('otp')?.value;

    if (!email || !otp || this.otpForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter a valid email and 4-digit OTP!',
      });
      return;
    }

    this.isVerifyingOtp = true;
    this.internService.validateOtp(email, otp)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (response: any) => {
        if (response.success) {
          this.otpForm.disable(); // Disable OTP fields after successful validation
          this.sendApplicationFormLinkAndRedirect();
        } else {
          this.isVerifyingOtp = false;
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: response.message || 'Invalid or expired OTP. Please try again.',
          });
        }
      },
      error: (error: any) => {
        this.isVerifyingOtp = false;
        console.error('Validate OTP failed', error);
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.cd.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  showImagePopup() {
    if (this.previewUrl) {
      Swal.fire({
        imageUrl: this.previewUrl as string,
        imageHeight: 400,
        imageAlt: 'Profile Picture'
      });
    }
  }

  RedirectToLogin(){
    this.router.navigate(['/login'])
  }

  sendApplicationFormLinkAndRedirect() {
    const email = this.otpForm.get('email')?.value; // Get email from otpForm
    this.http.post('api/intern/send-application-link', { email })
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (response: any) => {
        this.isVerifyingOtp = false;
        console.log('Application link sent:', response);
        Swal.fire({
          icon: 'success',
          title: 'Link Sent!',
          text: response.message,
        }).then(() => {
          this.router.navigate(['/login']); // Redirect to login or a confirmation page
        });
      },
      error: (error: any) => {
        this.isVerifyingOtp = false;
        console.error('Failed to send application link:', error);
        let errorMessage = 'Failed to send application link. Please try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: errorMessage,
        });
      }
    });
  }
}
