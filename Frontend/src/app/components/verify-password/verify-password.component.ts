import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute
import { JSEncrypt } from 'jsencrypt';
import Swal from 'sweetalert2';
import { InternService } from '../../service/intern.service'; // Import InternService

@Component({
  selector: 'app-verify-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-password.component.html',
  styleUrl: './verify-password.component.css'
})
export class VerifyPasswordComponent implements OnInit {
  verifyPasswordForm!: FormGroup;
  publickey: string = '';
  private baseUrl = 'http://localhost:5101'; // Adjust if your backend URL is different
  internId: string | null = null; // To store internId from route

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute); // Inject ActivatedRoute
  internService = inject(InternService); // Inject InternService

  ngOnInit(): void {
    this.verifyPasswordForm = this.fb.group({
      password: ['', Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      this.internId = params.get('id');
      if (!this.internId) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'User ID not found in route.',
        }).then(() => {
          this.router.navigate(['/login']);
        });
      }
    });

    this.getPublicKey();
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
          text: 'Failed to load public key. Cannot proceed with password verification.',
        });
      }
    });
  }

  onSubmit(): void {
    if (this.verifyPasswordForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill all the required fields!',
      });
      return;
    }

    if (!this.publickey) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Public key not loaded. Cannot proceed with password verification.',
      });
      return;
    }

    const passwordToEncrypt = this.verifyPasswordForm.value.password;
    console.log('Password before encryption:', passwordToEncrypt);
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(this.publickey);
    const encryptedPassword = encrypt.encrypt(passwordToEncrypt);

    if (!encryptedPassword) {
      console.error('Encryption failed: encryptedPassword is null or empty.');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to encrypt password.',
      });
      return;
    }
    console.log('Encrypted password:', encryptedPassword);

    const payload = {
      password: encryptedPassword
    };

    if (!this.internId) {
      Swal.fire('Error', 'User ID not found.', 'error');
      return;
    }

    this.internService.verifyPassword(this.internId, payload.password).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Password verified successfully.',
        }).then(() => {
          this.router.navigate(['/reset-password', this.internId]);
        });
      },
      error: (err) => {
        console.error('Password verification failed:', err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.error || 'Password verification failed.',
        });
      }
    });
  }
}
