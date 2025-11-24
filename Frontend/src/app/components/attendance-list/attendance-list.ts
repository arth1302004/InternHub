import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AttendanceService } from '../../service/attendance.service';
import { SharedService } from '../../service/shared.service';
import { PagedList } from '../../models/paged-list';
import { AttendanceRecord } from '../../models/attendance-record';

@Component({
  selector: 'app-attendance-list',
  imports: [CommonModule,HttpClientModule],
  templateUrl: './attendance-list.html',
  styleUrl: './attendance-list.css'
})
export class AttendanceList implements OnInit {
  attendanceData = signal<AttendanceRecord[]>([]);
  isLoading: boolean = true;
  error: string | null = null;
  attendanceService = inject(AttendanceService);
  sharedService = inject(SharedService);

  currentPage: number = 1;
  pageSize: number = 5; // You can adjust this
  totalCount: number = 0;
  totalPages: number = 0;

  ngOnInit(): void {
    this.fetchAttendanceData();
    this.sharedService.attendanceUpdated.subscribe(() => {
      this.fetchAttendanceData();
    });
  }

  fetchAttendanceData(): void {
    this.isLoading = true;
    this.error = null;

    const userRole = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    if (userRole === 'admin') {
      this.attendanceService.GetAllAttendance(this.currentPage, this.pageSize).subscribe({
        next: (pagedList: PagedList<AttendanceRecord>) => {
          this.attendanceData.set(pagedList.items);
          this.totalCount = pagedList.totalCount;
          this.totalPages = pagedList.totalPages;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to fetch attendance data for admin.';
          this.isLoading = false;
          console.error('Error fetching attendance for admin:', err);
        }
      });
    } else if (userRole === 'intern' && userId) {
      this.attendanceService.GetAttendanceByIntern(userId, this.currentPage, this.pageSize).subscribe({
        next: (pagedList: PagedList<AttendanceRecord>) => {
          this.attendanceData.set(pagedList.items);
          this.totalCount = pagedList.totalCount;
          this.totalPages = pagedList.totalPages;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to fetch attendance data for intern.';
          this.isLoading = false;
          console.error('Error fetching attendance for intern:', err);
        }
      });
    } else {
      this.error = 'User role or ID not found.';
      this.isLoading = false;
    }
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchAttendanceData();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchAttendanceData();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.fetchAttendanceData();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'present':
        return 'bg-[#f4f4e6] text-[#1c1c0d]';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-[#f4f4e6] text-[#1c1c0d]';
    }
  }
}