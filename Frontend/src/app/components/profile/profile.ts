import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InternService } from '../../service/intern.service';
import { AdminService } from '../../service/admin.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true, // Make sure it is standalone
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private internService = inject(InternService);
  private adminService = inject(AdminService);

  userData = signal<any>(null);
  loading = signal<boolean>(true);
  error = signal<string>('');
  isOwnProfile = signal<boolean>(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const loggedInUserId = localStorage.getItem('userId');
      const loggedInUserRole = localStorage.getItem('role');

      if (id) {
        // Viewing someone else's profile
        this.isOwnProfile.set(id === loggedInUserId);
        this.fetchInternData(id);
      } else if (loggedInUserId && loggedInUserRole) {
        // Viewing own profile
        this.isOwnProfile.set(true);
        if (loggedInUserRole === 'admin') {
          this.fetchAdminData(loggedInUserId);
        } else {
          this.fetchInternData(loggedInUserId);
        }
      } else {
        this.error.set('User ID not found.');
        this.loading.set(false);
      }
    });
  }

  fetchInternData(id: string): void {
    this.loading.set(true);
    this.internService.GetInternById(id).subscribe({
      next: (data) => {
        this.userData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to fetch intern data');
        this.loading.set(false);
        console.error('Error fetching intern data:', err);
      }
    });
  }

  fetchAdminData(id: string): void {
    this.loading.set(true);
    this.adminService.GetAdminById(id).subscribe({
      next: (data) => {
        this.userData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to fetch admin data');
        this.loading.set(false);
        console.error('Error fetching admin data:', err);
      }
    });
  }

  goToEditProfile(): void {
    const userId = this.userData()?.internId || this.userData()?.id;
    if (userId) {
      this.router.navigate(['/edit-profile', userId]);
    } else {
       this.router.navigate(['/edit-profile']);
    }
  }

  goToResetPassword(): void {
    const internId = this.userData()?.internId;
    if (internId) {
      this.router.navigate([`/verify-password/${internId}`]);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Could not retrieve intern ID for password reset.',
      });
    }
  }

  showImagePopup(): void {
    if (this.userData()?.profileImageUrl) {
      Swal.fire({
        imageUrl: this.userData().profileImageUrl as string,
        imageHeight: 400,
        imageAlt: 'Profile Picture'
      });
    }
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }
}