import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InternService } from '../../services/intern.service';
import { Intern } from '../../models/user.model';

@Component({
  selector: 'app-intern-directory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './intern-directory.component.html',
  styleUrl: './intern-directory.component.scss'
})
export class InternDirectoryComponent implements OnInit {
  searchTerm = signal('');
  selectedDepartment = signal('all');
  selectedStatus = signal('all');
  showAddInternDialog = signal(false);
  
  filteredInterns = signal<Intern[]>([]);

  departments = ['all', 'Engineering', 'Marketing', 'Design', 'Data Science', 'Product'];
  statuses = ['all', 'active', 'completed', 'onboarding'];

  constructor(
    public internService: InternService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateFilteredInterns();
  }

  updateFilteredInterns(): void {
    let interns = this.internService.interns();

    // Filter by search term
    if (this.searchTerm()) {
      interns = this.internService.searchInterns(this.searchTerm());
    }

    // Filter by department
    if (this.selectedDepartment() !== 'all') {
      interns = interns.filter(intern => intern.department === this.selectedDepartment());
    }

    // Filter by status
    if (this.selectedStatus() !== 'all') {
      interns = interns.filter(intern => intern.status === this.selectedStatus());
    }

    this.filteredInterns.set(interns);
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.updateFilteredInterns();
  }

  onDepartmentChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedDepartment.set(target.value);
    this.updateFilteredInterns();
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedStatus.set(target.value);
    this.updateFilteredInterns();
  }

  openAddInternDialog(): void {
    this.showAddInternDialog.set(true);
  }

  closeAddInternDialog(): void {
    this.showAddInternDialog.set(false);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'onboarding':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getRatingStars(rating: number | null): string {
    if (rating === null) return '—';
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  }

  viewInternProfile(internId: number): void {
    this.router.navigate(['/admin/intern', internId]);
  }

  editIntern(internId: number): void {
    // TODO: Implement edit functionality
    console.log('Edit intern:', internId);
  }

  deleteIntern(internId: number): void {
    // TODO: Implement delete functionality with confirmation
    console.log('Delete intern:', internId);
  }
}