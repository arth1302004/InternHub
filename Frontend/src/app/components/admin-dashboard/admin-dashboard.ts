import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FeatherModule } from 'angular-feather';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { AddIntern } from '../add-intern/add-intern'; // Import AddIntern component
import { Router } from '@angular/router'; // Import Router
import { DashboardStats } from '../../models/dashboard';

interface Activity {
  description: string;
  timestamp: string;
}

interface UpcomingDeadline {
  taskName: string;
  internName: string;
  dueDate: string;
  priority: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FeatherModule, TimeAgoPipe, AddIntern], // Add AddIntern here
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  showAddInternModal: boolean = false; // New property to control modal visibility

  dynamicStats = [
    {
      title: 'Active Interns',
      value: '0',
      change: '+0 this month',
      icon: 'users',
      color: 'text-blue-600'
    },
    {
      title: 'Pending Applications',
      value: '0',
      change: '+0 new today',
      icon: 'file-check',
      color: 'text-orange-600'
    },
    {
      title: 'Tasks Completed',
      value: '0',
      change: '+0 this week',
      icon: 'check-circle',
      color: 'text-green-600'
    },
    {
      title: 'Avg Performance',
      value: '0/5',
      change: '+0 from last month',
      icon: 'trending-up',
      color: 'text-purple-600'
    }
  ];

  recentActivity: any[] = [];

  upcomingDeadlines: UpcomingDeadline[] = [];

  private http = inject(HttpClient);
  private router = inject(Router); // Inject Router
  private baseUrl = 'https://localhost:7140'; // Adjust if your backend URL is different

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.http.get<DashboardStats>(`${this.baseUrl}/api/dashboard/stats`).subscribe({
      next: (stats) => {
        this.dynamicStats[0].value = stats.activeInterns.toString();
        this.dynamicStats[0].change = stats.activeInternsChange;
        this.dynamicStats[1].value = stats.pendingApplications.toString();
        this.dynamicStats[1].change = stats.pendingApplicationsChange;
        this.dynamicStats[2].value = stats.completedTasks.toString();
        this.dynamicStats[2].change = stats.completedTasksChange;
        this.dynamicStats[3].value = `${stats.averagePerformance.toFixed(1)}/5`;
        this.dynamicStats[3].change = stats.averagePerformanceChange;
      },
      error: (err) => {
        console.error('Error fetching dashboard stats:', err);
      }
    });

    // Fetch Recent Activities
    this.http.get<Activity[]>(`${this.baseUrl}/api/dashboard/recent-activity`).subscribe({
      next: (activities) => {
        this.recentActivity = activities.map(activity => {
          const utcDate = new Date(activity.timestamp);

          // Convert to IST
          const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));

          return {
            id: Math.random(), // Dummy ID
            type: this.getActivityType(activity.description),
            message: activity.description,
            time: istDate,
            icon: this.getIconName(this.getActivityType(activity.description))
          };
        });
      },
      error: (err) => {
        console.error('Error fetching recent activities:', err);
      }
      });

    // Fetch Upcoming Deadlines
    this.http.get<UpcomingDeadline[]>(`${this.baseUrl}/api/dashboard/upcoming-deadlines`).subscribe({
      next: (deadlines) => {
        this.upcomingDeadlines = deadlines;
      },
      error: (err) => {
        console.error('Error fetching upcoming deadlines:', err);
      }
    });
  }

  // Helper to determine activity type for icon
  getActivityType(message: string): string {
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes('application') || lowerCaseMessage.includes('applied')) {
      return 'application';
    } else if (lowerCaseMessage.includes('task')) {
      return 'task';
    } else if (lowerCaseMessage.includes('evaluation') || lowerCaseMessage.includes('clocked in')) {
      return 'evaluation';
    }
    return 'unknown'; // Default for unknown
  }

  getIconName(activityType: string): string {
    switch (activityType) {
      case 'application':
        return 'file-text';
      case 'task':
        return 'check-circle';
      case 'evaluation':
        return 'bar-chart-2';
      default:
        return 'alert-circle';
    }
  }

  // New methods for modal
  openAddInternModal() {
    this.showAddInternModal = true;
  }

  handleEmailSubmission(email: string) {
    console.log('Intern email submitted:', email);
    // TODO: Call backend API to send registration link
    this.closeAddInternModal();
  }

  closeAddInternModal() {
    this.showAddInternModal = false;
  }

  // New method for navigation
  reviewPendingApplications() {
    this.router.navigate(['/admin-approvals']); // Assuming this is the correct route
  }

  createEvaluation() {
    this.router.navigate(['/evaluation']); // Navigate to the evaluation creation page
  }
}