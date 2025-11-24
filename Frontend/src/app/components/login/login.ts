import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InternService } from '../../service/intern.service';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs/operators';
import { SharedService } from '../../service/shared.service';
import { HttpClient } from '@angular/common/http';
import { JSEncrypt } from 'jsencrypt';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login  implements OnInit{

  UserLoginForm!:FormGroup;
  fb = inject(FormBuilder);
  router = inject(Router)
  loginCreds!:Login;
  token!:string;
  role!:string;
  username!:string;
  userId!:string;
  IsInCorrectForm:boolean = false
  isLoading: boolean = false;
  isLoginDisabled: boolean = false;
  disabledUntil: Date | null = null;
  countdown: string | null = null;
  private timerInterval: any;
  inteRnService = inject(InternService)
  authService = inject(AuthService)
  sharedService = inject(SharedService)
  http = inject(HttpClient); // Inject HttpClient
  publickey: string = '';
  private baseUrl = 'https://localhost:7140'; // Adjust if your backend URL is different

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    this.UserLoginForm = this.fb.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
    this.getPublicKey(); // Fetch public key on init
  }

  getPublicKey(): void {
    this.http.get(`${this.baseUrl}/api/Login/public-key`, { responseType: 'text' }).subscribe({
      next: (key) => {
        this.publickey = key;
        console.log('Public Key fetched:', this.publickey);
      },
      error: (err) => {
        console.error('Error fetching public key:', err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to load public key. Cannot proceed with login.',
        });
      }
    });
  }
  RedirectoSignup(){
    this.router.navigate(['/sign-up'])
  }
  RedirectToForgotPassword(){
    this.router.navigate(['/forgot-password'])

  }
  onSubmit(){
    console.log('onSubmit called');
    if(this.UserLoginForm.valid){
      console.log('Form is valid');
      if (!this.publickey) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Public key not loaded. Cannot proceed with login.',
        });
        return;
      }

      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(this.publickey);
      const passwordToEncrypt = this.UserLoginForm.value.password;
      console.log('Password before encryption:', passwordToEncrypt);
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

      const  data = { ...this.UserLoginForm.value, password: encryptedPassword }; // Create a new object with encrypted password
      console.log(data);
      this.isLoading = true;
     this.authService.UserLogin(data).pipe(
        finalize(() => {
          console.log('Finalize called');
          this.isLoading = false
        })
      ).subscribe(
       {next:(response:any)=>{
        console.log('Next handler called');
        console.log('Login successful response:', response); // Added console.log
        this.token = response.token;
        this.role = response.role;
        this.username  = response.username;
        this.userId = response.userId;
        this.sharedService.notifyPasswordResetStatus(response.isPasswordReset);

        console.log(this.role)
        console.log(this.token)
        localStorage.setItem('token',this.token);
        localStorage.setItem('role',this.role)
        localStorage.setItem('username',this.username)
        localStorage.setItem('userId',this.userId)
        
         console.log(this.token)
         this.sharedService.notifyLoginSuccess();

         // Always show success message first
         Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'You have successfully logged in.',
          showConfirmButton: false, // Hide default confirm button
          timer: 1500 // Auto close after 1.5 seconds
         }).then(() => {
            // After the initial success message, check for password reset
            if (!response.isPasswordReset) {
              Swal.fire({
                icon: 'warning',
                title: 'Password Reset Required!',
                text: 'You are yet to reset your password.',
                showCancelButton: true,
                confirmButtonText: 'Reset Now',
                cancelButtonText: 'Cancel',
                allowOutsideClick: false, // Prevent closing by clicking outside
                allowEscapeKey: false // Prevent closing by escape key
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/verify-password', this.userId]);
                } else {
                  // User clicked cancel, proceed with normal navigation
                  this.navigateToDashboard(this.role);
                }
              });
            } else {
              // Password already reset, proceed with normal navigation
              this.navigateToDashboard(this.role);
            }
         });
      },
      error:(error:any)=>{
        console.log('Error handler called');
        console.error('Login error response:', error); // Added console.error

        // Removed the specific 400 error handling as it's no longer expected for password reset
        // if (error.status === 400 && error.error && error.error.message === 'Password reset required') {
        //   console.log('Password reset required for user:', error.error.userId);
        // }

        this.IsInCorrectForm = true;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Invalid username or password!',
        });
      }
    }
     );
     
    }
    else{
      this.IsInCorrectForm = true
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill all the required fields!',
      });
    }
  }

  navigateToDashboard(role: string): void {
    if (role && role.toLowerCase() === 'admin') {
      this.router.navigate(['/admin-dashboard']);
    } else if (role && role.toLowerCase() === 'intern') {
      this.router.navigate(['/attendances']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
} 
