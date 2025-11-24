import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { InternService } from '../../service/intern.service';
import { CommonModule } from '@angular/common';
import { IIntern } from '../../models/intern';
import { AuthService } from '../../service/auth.service';
import { SharedService } from '../../service/shared.service';
import { IAdmin } from '../../models/admin';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule,CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  intern: IIntern | null = null;
  admin:IAdmin | null= null;
  internService = inject(InternService);
  userRole: string | null = null;
  isClockedIn: boolean = false;
  clockInTime: string | null = null;

  authService = inject(AuthService);
  sharedService = inject(SharedService);
  adminService = inject(AdminService)

  showPasswordResetMessage = false;

  constructor(private router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(() => {
      this.updateHeader();
      this.loadClockInState(); // Load clock-in state on init
    });

    this.sharedService.passwordResetStatus$.subscribe(status => {
      if (this.authService.getUserRole() === 'intern') {
        this.showPasswordResetMessage = !status;
        this.cd.detectChanges();
      }
    });
  }

  loadClockInState(): void {
    if (typeof localStorage !== 'undefined') {
      const clockedIn = localStorage.getItem('isClockedIn');
      const clockTime = localStorage.getItem('clockInTime');
      if (clockedIn === 'true' && clockTime) {
        this.isClockedIn = true;
        this.clockInTime = clockTime;
      } else {
        this.isClockedIn = false;
        this.clockInTime = null;
      }
    }
  }

  toggleClockIn(): void {
    if (!this.isClockedIn) {
      // Clock In
      const internId = this.authService.getUserId();
      console.log(internId)
      if (internId) {
        const currentTime = new Date();
        const formattedTime = currentTime.toLocaleTimeString(); 
        const attendanceData = {
          internId: internId,
          clockInTime: currentTime.toISOString() 
        };
        const data = {
        status: "string"
      };

        this.internService.MarkAttendance(internId,data).subscribe(
          (response) => {
            console.log('Attendance marked:', response);
            this.isClockedIn = true;
            this.clockInTime = formattedTime;
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('isClockedIn', 'true');
              localStorage.setItem('clockInTime', formattedTime);
            }
            Swal.fire({
              icon: 'success',
              title: 'Clocked In!',
              text: `You have successfully clocked in at ${formattedTime}.`
            });
            this.loadClockInState();
            this.sharedService.notifyAttendanceUpdated();
            this.cd.detectChanges(); 
          },
          (error) => {
            console.error('Error marking attendance:', error);
            Swal.fire({
              icon: 'error',
              title: 'Clock-in Failed',
              text: 'Failed to clock in. Please try again.'
            });
          } 
        );
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'User ID not found. Cannot clock in.'
        });
      }
    } else {
      // Already clocked in, do nothing or provide feedback
      Swal.fire({
        icon: 'info',
        title: 'Already Clocked In',
        text: `You are already clocked in since ${this.clockInTime}.`
      });
    }
  }

  updateHeader(): void {
    if (typeof localStorage !== 'undefined') {
      this.userRole = localStorage.getItem('role');
      console.log('User Role from localStorage:', this.userRole);
      let internId;
      let adminId; // Add this line
      if(this.userRole == 'intern'){
        internId = localStorage.getItem('userId');  
      }
      else if(this.userRole == 'admin'){
        adminId = localStorage.getItem('userId');
      }
      if (internId) {
        const cleanedInternId = internId.endsWith(':1') ? internId.slice(0, -2) : internId;
        this.internService.GetInternById(cleanedInternId).subscribe({
          next: (data) => {
            this.intern = data;
            this.cd.detectChanges();
          },
          error: (err) => {
            console.error("Failed to get intern data", err);
          }
        });
      }
      else if(adminId){
        const cleanedAdminId = adminId.endsWith(':1') ? adminId.slice(0, -2) : adminId;
        this.adminService.GetAdminById(cleanedAdminId).subscribe({
          next: (data) => {
            this.admin = data;
            this.cd.detectChanges();
          },
          error: (err) => {
            console.error("Failed to get admin data", err);
          }
        });
      }
    }
  }

  resetPassword() {
    this.router.navigate(['/intern-profile']);
    this.showPasswordResetMessage = false;
  }

  cancelResetPassword() {
    this.showPasswordResetMessage = false;
  }

  toggleSidebar() {
    this.sharedService.toggleSidebar();
  }

  logout(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.intern = null;
        this.userRole = null;
        this.router.navigate(['/login']);
      }
    });
  }

  viewProfile(): void {
    if (this.userRole === 'admin') {
      this.router.navigate(['/admin-profile']);
    } else if (this.intern) {
      this.router.navigate(['/intern-profile']);
    }
  }

  showImagePopup(): void {
    if (this.intern?.profileImageUrl) {
      Swal.fire({
        imageUrl: this.intern.profileImageUrl,
        imageHeight: 400,
        imageAlt: 'Profile Picture'
      });
    }
  }
}

