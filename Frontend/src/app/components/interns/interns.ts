import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { InternService } from '../../service/intern.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-interns',
  standalone: true,
  templateUrl: './interns.html',
  styleUrls: ['./interns.css'],
  imports: [CommonModule, FormsModule, MatMenuModule]
})
export class Interns implements OnInit {
  interns = signal<any[]>([]);
  filteredInterns = signal<any[]>([]);
  loading = signal<boolean>(true);
  departments = signal<string[]>(['Engineering', 'Marketing', 'Design', 'Operations', 'Product']);
  selectedDepartment = '';
  selectedStatus = '';
  statuses = signal<string[]>(['active', 'inactive']);

  currentPage: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  totalPages: number = 0;
  searchTerm: string = '';

  sortKey: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  private internService = inject(InternService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadInterns();
  }

  loadInterns(): void {
    this.loading.set(true);
    this.internService.GetAllInterns(this.currentPage, this.pageSize, this.searchTerm, this.sortKey, this.sortDirection, this.selectedDepartment, this.selectedStatus)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (pagedList: any) => {
          const internsWithDetails = pagedList.items.map((intern: any) => ({
            ...intern,
            department: this.getDepartment(intern.emailAddress),
            rating: parseFloat((Math.random() * (5 - 3) + 3).toFixed(1))
          }));
          this.interns.set(internsWithDetails);
          this.filteredInterns.set(internsWithDetails);
          this.totalCount = pagedList.totalCount;
          this.totalPages = pagedList.totalPages;
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error fetching interns:', err);
          this.loading.set(false);
        }
      });
  }

  searchInterns(): void {
    this.currentPage = 1;
    this.loadInterns();
  }

  filterInterns(): void {
    this.currentPage = 1;
    this.loadInterns();
  }

  onSortKeyChange(): void {
    this.currentPage = 1;
    this.loadInterns();
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.currentPage = 1;
    this.loadInterns();
  }

  getDepartment(email: string): string {
    const domains: { [key: string]: string } = {
      'gmail.com': 'Engineering',
      'company.com': 'Product',
      'example.com': 'Design'
    };
    const domain = email.split('@')[1];
    return domains[domain] || 'Operations';
  }

  getStatusBadgeClass(status: string): string {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  viewProfile(internId: string): void {
    this.router.navigate(['/view-profile', internId]);
  }

  editIntern(internId: string): void {
    this.router.navigate(['/edit-profile', internId]);
  }

  addIntern(): void {
    this.router.navigate(['/add-intern']);
  }

  deleteIntern(internId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.internService.DeleteIntern(internId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              Swal.fire(
                'Deleted!',
                'Intern has been deleted.',
                'success'
              );
              this.loadInterns();
            },
            error: (err) => {
              console.error('Error deleting intern:', err);
              Swal.fire(
                'Error!',
                'There was an error deleting the intern.',
                'error'
              );
            }
          });
      }
    });
  }
}
