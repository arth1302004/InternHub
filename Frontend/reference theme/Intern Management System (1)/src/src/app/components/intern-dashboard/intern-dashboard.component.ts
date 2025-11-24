import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

type NavigationItem = {
  id: string;
  name: string;
  icon: string;
  badge?: number;
};

@Component({
  selector: 'app-intern-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intern-dashboard.component.html',
  styleUrl: './intern-dashboard.component.scss'
})
export class InternDashboardComponent {
  activeSection = signal('dashboard');
  sidebarCollapsed = signal(false);

  internNavigation: NavigationItem[] = [
    { id: 'dashboard', name: 'Dashboard', icon: 'home' },
    { id: 'profile', name: 'My Profile', icon: 'user' },
    { id: 'applications', name: 'My Applications', icon: 'file-text', badge: 2 },
    { id: 'tasks', name: 'My Tasks', icon: 'clipboard-list', badge: 3 },
    { id: 'evaluations', name: 'Evaluations', icon: 'star' },
    { id: 'documents', name: 'Documents', icon: 'folder' },
    { id: 'learning', name: 'Learning', icon: 'book' },
  ];

  constructor(public authService: AuthService) {}

  setActiveSection(sectionId: string): void {
    this.activeSection.set(sectionId);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }

  logout(): void {
    this.authService.logout();
  }

  getCurrentSectionName(): string {
    const current = this.internNavigation.find(item => item.id === this.activeSection());
    return current ? current.name : 'Dashboard';
  }

  getUserInitials(): string {
    const user = this.authService.getCurrentUser();
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'IN';
  }

  // Mock data methods
  getMockTasks() {
    return [
      { id: 1, title: 'Complete onboarding documentation', status: 'pending', priority: 'high', dueDate: '2025-01-10' },
      { id: 2, title: 'Review project requirements', status: 'in-progress', priority: 'medium', dueDate: '2025-01-12' },
      { id: 3, title: 'Submit weekly report', status: 'completed', priority: 'low', dueDate: '2025-01-08' }
    ];
  }

  getMockApplications() {
    return [
      { id: 1, position: 'Software Engineering Intern', company: 'TechCorp', status: 'under-review', appliedDate: '2025-01-05' },
      { id: 2, position: 'Marketing Intern', company: 'StartupXYZ', status: 'interview-scheduled', appliedDate: '2025-01-03' }
    ];
  }

  getCompletedTasksCount(): number {
    return this.getMockTasks().filter(task => task.status === 'completed').length;
  }

  getProgressPercentage(): number {
    const tasks = this.getMockTasks();
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / tasks.length) * 100);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}