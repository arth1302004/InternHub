import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternService } from '../../services/intern.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  @Output() navigate = new EventEmitter<string>();

  showAddInternDialog = false;

  constructor(public internService: InternService) {}

  ngOnInit(): void {
    // Component initialization
  }

  onNavigate(section: string): void {
    this.navigate.emit(section);
  }

  openAddInternDialog(): void {
    this.showAddInternDialog = true;
  }

  closeAddInternDialog(): void {
    this.showAddInternDialog = false;
  }

  getRecentInterns() {
    return this.internService.interns().slice(0, 5);
  }

  getUpcomingTasks() {
    return [
      { title: 'Review applications', dueDate: '2025-01-10', priority: 'high' },
      { title: 'Schedule intern meetings', dueDate: '2025-01-12', priority: 'medium' },
      { title: 'Update evaluation forms', dueDate: '2025-01-15', priority: 'low' }
    ];
  }

  getRecentActivities() {
    return [
      { activity: 'New intern application submitted', time: '2 hours ago', type: 'application' },
      { activity: 'Sarah Chen completed task', time: '4 hours ago', type: 'task' },
      { activity: 'Evaluation submitted for Alex Rodriguez', time: '1 day ago', type: 'evaluation' },
      { activity: 'New document uploaded', time: '2 days ago', type: 'document' }
    ];
  }
}