import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { InternService } from '../../services/intern.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { InternDirectoryComponent } from '../intern-directory/intern-directory.component';

type NavigationItem = {
  id: string;
  name: string;
  icon: string;
  badge?: number;
};

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardComponent, InternDirectoryComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  activeSection = signal('dashboard');
  sidebarCollapsed = signal(false);

  navigation: NavigationItem[] = [
    { id: 'dashboard', name: 'Dashboard', icon: 'home' },
    { id: 'interns', name: 'Intern Directory', icon: 'users' },
    { id: 'applications', name: 'Applications', icon: 'file-text', badge: 5 },
    { id: 'tasks', name: 'Task Management', icon: 'clipboard-list' },
    { id: 'evaluations', name: 'Evaluations', icon: 'star' },
    { id: 'documents', name: 'Documents', icon: 'folder' },
    { id: 'analytics', name: 'Analytics', icon: 'bar-chart-3' },
  ];

  constructor(
    public authService: AuthService,
    public internService: InternService
  ) {}

  ngOnInit(): void {
    // Check for fragment navigation
    if (window.location.hash === '#interns') {
      this.activeSection.set('interns');
    }
  }

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
    const current = this.navigation.find(item => item.id === this.activeSection());
    return current ? current.name : 'Dashboard';
  }

  getUserInitials(): string {
    const user = this.authService.getCurrentUser();
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'AD';
  }
}