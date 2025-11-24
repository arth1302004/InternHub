import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { InternService } from '../../services/intern.service';
import { Intern } from '../../models/user.model';

@Component({
  selector: 'app-intern-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intern-profile.component.html',
  styleUrl: './intern-profile.component.scss'
})
export class InternProfileComponent implements OnInit {
  intern = signal<Intern | null>(null);
  loading = signal(true);
  error = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private internService: InternService
  ) {}

  ngOnInit(): void {
    const internId = this.route.snapshot.paramMap.get('id');
    if (internId) {
      this.loadIntern(parseInt(internId));
    } else {
      this.error.set('Invalid intern ID');
      this.loading.set(false);
    }
  }

  loadIntern(id: number): void {
    const internData = this.internService.getInternById(id);
    if (internData) {
      this.intern.set(internData);
    } else {
      this.error.set('Intern not found');
    }
    this.loading.set(false);
  }

  goBack(): void {
    this.router.navigate(['/admin'], { fragment: 'interns' });
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getRatingStars(rating: number | null): string {
    if (rating === null) return '—';
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  }

  // Mock additional data that would typically come from a more detailed API
  getProjectsData() {
    return [
      {
        id: 1,
        name: 'User Authentication System',
        description: 'Implemented secure login and registration functionality',
        status: 'completed',
        completedDate: '2024-12-15'
      },
      {
        id: 2,
        name: 'Dashboard Analytics',
        description: 'Building real-time analytics dashboard with charts',
        status: 'in-progress',
        progress: 75
      },
      {
        id: 3,
        name: 'Mobile App Integration',
        description: 'API integration for mobile application',
        status: 'pending',
        startDate: '2025-01-20'
      }
    ];
  }

  getTasksData() {
    return [
      {
        id: 1,
        title: 'Complete code review',
        status: 'completed',
        priority: 'high',
        completedDate: '2025-01-05'
      },
      {
        id: 2,
        title: 'Update documentation',
        status: 'in-progress',
        priority: 'medium',
        dueDate: '2025-01-15'
      },
      {
        id: 3,
        title: 'Prepare weekly report',
        status: 'pending',
        priority: 'low',
        dueDate: '2025-01-12'
      }
    ];
  }

  getEvaluationsData() {
    return [
      {
        id: 1,
        evaluator: 'John Smith',
        date: '2024-12-20',
        score: 4.5,
        feedback: 'Excellent work on the authentication system. Shows great attention to detail and problem-solving skills.',
        criteria: {
          'Technical Skills': 4.5,
          'Communication': 4.0,
          'Problem Solving': 5.0,
          'Teamwork': 4.0,
          'Initiative': 4.5
        }
      },
      {
        id: 2,
        evaluator: 'Sarah Lee',
        date: '2024-11-15',
        score: 4.2,
        feedback: 'Good progress in the first month. Adapting well to the team and showing enthusiasm to learn.',
        criteria: {
          'Technical Skills': 4.0,
          'Communication': 4.5,
          'Problem Solving': 4.0,
          'Teamwork': 4.5,
          'Initiative': 4.0
        }
      }
    ];
  }

  editIntern(): void {
    // TODO: Implement edit functionality
    console.log('Edit intern:', this.intern()?.id);
  }

  deleteIntern(): void {
    // TODO: Implement delete functionality with confirmation
    console.log('Delete intern:', this.intern()?.id);
  }
}