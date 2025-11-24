import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  isOpen = false;
  userRole: string | null = null;
  sharedService = inject(SharedService);

  constructor() {
    this.sharedService.sidebarToggle.subscribe(() => {
      this.isOpen = !this.isOpen;
    });
    this.userRole = localStorage.getItem('role');
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  closeSidebar() {
    this.isOpen = false;
  }
}
