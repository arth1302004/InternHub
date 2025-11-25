import { Component, inject, OnInit, ChangeDetectorRef, signal } from '@angular/core';
import { InternService } from '../../service/intern.service';
import { AdminService } from '../../service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IIntern } from '../../models/intern';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './edit-profile.html',
  styleUrls: ['./edit-profile.css']
})
export class EditProfile implements OnInit {
  intern: IIntern = {} as IIntern;
  adminData: any = {};
  selectedFile: File | null = null;
  selectedImagePreview: string | ArrayBuffer | null = null;
  internService = inject(InternService);
  adminService = inject(AdminService);
  router = inject(Router);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute)
  authService = inject(AuthService);
  cd = inject(ChangeDetectorRef);
  profileForm!: FormGroup;
  internId = signal<string>('')
  role = signal<string | null>('')

  ngOnInit(): void {

    this.role.set(localStorage.getItem('role'))
    if (this.role() == "admin") {
      const ParamsId = this.route.snapshot.paramMap.get('id')
      this.internId.set(ParamsId ? ParamsId : 'none')

      // If editing another user's profile (admin editing intern)
      if (this.internId() !== 'none') {
        this.initializeForm();
        this.internService.GetInternById(this.internId()).subscribe(data => {
          this.intern = data;
          this.populateForm(data);
        });
      } else {
        // Admin editing own profile
        this.initializeAdminForm();
        const adminId = localStorage.getItem('userId');
        if (adminId) {
          this.adminService.GetAdminById(adminId).subscribe((data: any) => {
            this.populateAdminForm(data);
          });
        }
      }
    }
    if (this.role() == 'intern') {
      this.initializeForm();
      const internId = localStorage.getItem('userId');
      if (internId) {
        this.internService.GetInternById(internId).subscribe(data => {
          this.intern = data;
          this.populateForm(data);
        });
      }
    }
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      emailAddress: ['', [Validators.required, Validators.email]],
      profileImage: [null]
    });
  }

  populateForm(internData: IIntern): void {
    this.profileForm.patchValue({
      name: internData.name,
      emailAddress: internData.emailAddress
    });
  }

  initializeAdminForm(): void {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.email]],
      fullName: [''],
      profileImage: [null]
    });
  }

  populateAdminForm(adminData: any): void {
    this.adminData = adminData;
    this.profileForm.patchValue({
      username: adminData.username,
      email: adminData.email || '',
      fullName: adminData.fullName || ''
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.profileForm.patchValue({ profileImage: file });
      this.profileForm.get('profileImage')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImagePreview = reader.result;
        this.cd.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    const formData = new FormData();

    if (this.role() === 'admin' && this.internId() === 'none') {
      // Admin updating own profile
      formData.append('username', this.profileForm.get('username')?.value);
      formData.append('email', this.profileForm.get('email')?.value || '');
      formData.append('fullName', this.profileForm.get('fullName')?.value || '');

      if (this.selectedFile) {
        formData.append('profilePic', this.selectedFile);
      }

      const adminId = localStorage.getItem('userId');
      if (adminId) {
        this.adminService.UpdateAdmin(adminId, formData).subscribe(() => {
          this.authService.notifyProfileUpdate();
          Swal.fire({
            title: 'Success!',
            text: 'Profile updated successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/admin-profile']);
          });
        });
      }
    } else {
      // Intern profile update
      formData.append('name', this.profileForm.get('name')?.value);
      formData.append('emailAddress', this.profileForm.get('emailAddress')?.value);

      if (this.selectedFile) {
        formData.append('profilePic', this.selectedFile);
      }

      this.internService.UpdateIntern(this.intern.internId, formData).subscribe(() => {
        this.authService.notifyProfileUpdate();
        Swal.fire({
          title: 'Success!',
          text: 'Profile updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/profile']);
        });
      });
    }
  }

  cancel(): void {
    if (this.role() == "intern") {
      this.router.navigate(['/profile']);
    }
    else if (this.role() == 'admin') {
      this.router.navigate(['/interns'])
    }
  }

  showImagePopup(): void {
    const imageUrl = this.selectedImagePreview || this.intern.profileImageUrl;
    if (imageUrl) {
      Swal.fire({
        imageUrl: imageUrl as string,
        imageHeight: 400,
        imageAlt: 'Profile Picture'
      });
    }
  }
}