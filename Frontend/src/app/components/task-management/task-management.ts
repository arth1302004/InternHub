import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { TasksService } from '../../service/tasks.service';
import { InternService } from '../../service/intern.service';
import { Task, TaskCreate, TaskDetail } from '../../models/task.model';
import { IIntern } from '../../models/intern';

@Component({
  selector: 'app-task-management',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './task-management.html',
  styleUrls: ['./task-management.css']
})
export class TaskManagement implements OnInit {
  private tasksService = inject(TasksService);
  private internService = inject(InternService);
  private fb = inject(FormBuilder);

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  interns: IIntern[] = [];
  selectedTask: TaskDetail | null = null;

  isCreateTaskModalOpen = false;
  isViewTaskModalOpen = false;

  createTaskForm!: FormGroup;

  // Filters
  searchTerm = '';
  selectedStatus = 'all';
  selectedPriority = 'all';

  // Summary counts
  toDoCount: number = 0;
  inProgressCount: number = 0;
  completedCount: number = 0;
  overdueCount: number = 0;

  ngOnInit(): void {
    this.loadTasks();
    this.loadInterns();
    this.initCreateTaskForm();
  }

  initCreateTaskForm(): void {
    this.createTaskForm = this.fb.group({
      taskName: ['', Validators.required],
      description: ['', Validators.required],
      assigneeIds: [[]],
      priority: ['', Validators.required],
      dueDate: ['', Validators.required],
      estimatedHours: [0],
      tags: ['']
    });
  }

  loadTasks(): void {
    this.tasksService.getAllTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.updateCounts();
      this.applyFilters();
    });
  }

  loadInterns(): void {
    this.internService.GetAllInterns(1, 100).subscribe(pagedList => {
      this.interns = pagedList.items;
    });
  }

  updateCounts(): void {
    this.toDoCount = this.tasks.filter(t => t.status === 'To Do').length;
    this.inProgressCount = this.tasks.filter(t => t.status === 'In Progress').length;
    this.completedCount = this.tasks.filter(t => t.status === 'Completed').length;
    this.overdueCount = this.tasks.filter(t => t.status === 'Overdue').length;
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = task.taskName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            task.assignedInterns.some(assignee => assignee.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesStatus = this.selectedStatus === 'all' || task.status.toLowerCase().replace(' ', '-') === this.selectedStatus;
      const matchesPriority = this.selectedPriority === 'all' || task.priority.toLowerCase() === this.selectedPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  formatAssignees(task: Task): string {
    const assignees = task.assignedInterns;
    if (assignees.length === 0) return '';
    const initials = assignees.map(a => a.name.split(' ').map(w => w[0].toUpperCase()).join('')).join(' ');
    if (assignees.length === 1) {
      return initials + ' ' + assignees[0].name;
    }
    return initials + ' ' + assignees[0].name + ' + ' + (assignees.length - 1) + ' other';
  }

  openCreateTaskModal(): void {
    this.isCreateTaskModalOpen = true;
  }

  closeCreateTaskModal(): void {
    this.isCreateTaskModalOpen = false;
    this.createTaskForm.reset();
  }

  openViewTaskModal(taskId: string): void {
    this.tasksService.getTaskById(taskId).subscribe(task => {
      this.selectedTask = task;
      this.isViewTaskModalOpen = true;
    });
  }

  closeViewTaskModal(): void {
    this.isViewTaskModalOpen = false;
    this.selectedTask = null;
  }

  onSubmitCreateTask(): void {
    if (this.createTaskForm.valid) {
      const formValue = this.createTaskForm.value;
      const newTask: TaskCreate = {
        taskName: formValue.taskName,
        description: formValue.description,
        status: 'To Do',
        dueDate: formValue.dueDate,
        priority: formValue.priority,
        tags: formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : [],
        internIds: formValue.assigneeIds,
        estimatedHours: formValue.estimatedHours
      };

      this.tasksService.createTask(newTask).subscribe(createdTask => {
        this.tasks.push(createdTask);
        this.updateCounts();
        this.applyFilters();
        this.closeCreateTaskModal();
      });
    }
  }

  deleteTask(taskId: string): void {
    this.tasksService.deleteTask(taskId).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.taskId !== taskId);
      this.updateCounts();
      this.applyFilters();
    });
  }
}