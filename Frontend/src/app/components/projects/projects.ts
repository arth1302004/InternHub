import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService, ProjectInterface, CreateProjectInterface, ProjectStatsInterface } from '../../service/project.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects implements OnInit {
  projects: ProjectInterface[] = [];
  filteredProjects: ProjectInterface[] = [];
  stats: ProjectStatsInterface | null = null;
  loading = true;
  searchTerm = '';
  statusFilter = 'all';
  priorityFilter = 'all';
  departmentFilter = 'all';
  viewMode: 'grid' | 'list' = 'grid';
  showCreateDialog = false;

  newProject: CreateProjectInterface = {
    title: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    startDate: '',
    endDate: '',
    budget: 0,
    teamLead: '',
    department: '',
    tags: []
  };

  departments: string[] = [];

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.loadProjects();
    this.loadStats();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.filteredProjects = data;
        this.extractDepartments();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.loading = false;
      }
    });
  }

  loadStats(): void {
    this.projectService.getProjectStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => console.error('Error loading stats:', err)
    });
  }

  extractDepartments(): void {
    const depts = new Set(this.projects.map(p => p.department).filter(d => d));
    this.departments = Array.from(depts) as string[];
  }

  applyFilters(): void {
    this.filteredProjects = this.projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.statusFilter === 'all' || project.status === this.statusFilter;
      const matchesPriority = this.priorityFilter === 'all' || project.priority === this.priorityFilter;
      const matchesDepartment = this.departmentFilter === 'all' || project.department === this.departmentFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  openCreateDialog(): void {
    this.showCreateDialog = true;
  }

  closeCreateDialog(): void {
    this.showCreateDialog = false;
    this.resetNewProject();
  }

  createProject(): void {
    if (!this.newProject.title.trim()) {
      alert('Project title is required');
      return;
    }

    this.projectService.createProject(this.newProject).subscribe({
      next: (project) => {
        this.projects.push(project);
        this.applyFilters();
        this.loadStats();
        this.closeCreateDialog();
        alert('Project created successfully');
      },
      error: (err) => {
        console.error('Error creating project:', err);
        alert('Error creating project');
      }
    });
  }

  deleteProject(id: string): void {
    if (!confirm('Are you sure you want to delete this project?')) return;

    this.projectService.deleteProject(id).subscribe({
      next: () => {
        this.projects = this.projects.filter(p => p.projectId !== id);
        this.applyFilters();
        this.loadStats();
        alert('Project deleted successfully');
      },
      error: (err) => {
        console.error('Error deleting project:', err);
        alert('Error deleting project');
      }
    });
  }

  resetNewProject(): void {
    this.newProject = {
      title: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      startDate: '',
      endDate: '',
      budget: 0,
      teamLead: '',
      department: '',
      tags: []
    };
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getDaysRemaining(endDate: string): number {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'planning': 'status-planning',
      'active': 'status-active',
      'on-hold': 'status-on-hold',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled'
    };
    return classes[status] || 'status-default';
  }

  getPriorityClass(priority: string): string {
    const classes: { [key: string]: string } = {
      'low': 'priority-low',
      'medium': 'priority-medium',
      'high': 'priority-high',
      'critical': 'priority-critical'
    };
    return classes[priority] || 'priority-low';
  }
}
