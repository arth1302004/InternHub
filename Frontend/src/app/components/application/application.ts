import { Component, OnInit, inject, AfterViewInit, ViewChildren, QueryList, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../service/application.service';
import { ApplicationResponseDto } from '../../models/application';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { ApplicationPreview } from '../application-preview/application-preview';
import { ModalStateService } from '../../services/modal-state.service';

interface ApplicationResponseDtoWithFallback extends ApplicationResponseDto {
  showInitialsFallback?: boolean;
}

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTabsModule, ApplicationPreview, RouterLink],
  templateUrl: './application.html',
  styleUrl: './application.css'
})
export class Application implements OnInit, AfterViewInit {
  applicationService = inject(ApplicationService);
  modalStateService = inject(ModalStateService);

  applications: ApplicationResponseDtoWithFallback[] = [];
  filteredApplications: ApplicationResponseDtoWithFallback[] = [];
  selectedApplication: ApplicationResponseDto | null = null;
  isModalOpen: boolean = false;
  searchTerm: string = '';
  isLoading: boolean = false;

  activeTab: string = 'All';
  tabs = ['All', 'Submitted', 'Review', 'Interview', 'Hired', 'Rejected'];
  sliderStyle: { left: string, width: string } = { left: '0px', width: '0px' };

  @ViewChildren('tabButton') tabElements!: QueryList<ElementRef>;

  @HostListener('window:resize')
  onResize() {
    const activeIndex = this.tabs.indexOf(this.activeTab);
    if (activeIndex !== -1) {
        this.updateSlider(activeIndex);
    }
  }

  ngOnInit(): void {
    this.getAllApplications();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateSlider(0);
    }, 0);
  }

  getAllApplications(): void {
    this.isLoading = true;
    this.applicationService.getAllApplications().subscribe({
      next: (data: ApplicationResponseDto[]) => {
        this.applications = data.map(app => ({ ...app, showInitialsFallback: false }));
        this.filterApplications();
        this.isLoading = false;
        setTimeout(() => this.updateSlider(this.tabs.indexOf(this.activeTab)), 100);
      },
      error: (err) => {
        console.error('Error fetching applications', err);
        this.isLoading = false;
      }
    });
  }

  filterApplications(): void {
    let tempApplications = this.applications;

    if (this.searchTerm) {
      tempApplications = tempApplications.filter(app =>
        app.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        app.internshipRole.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.activeTab !== 'All') {
      tempApplications = tempApplications.filter(app => app.status === this.activeTab);
    }

    this.filteredApplications = tempApplications;
  }

  onTabChange(tab: string, index: number): void {
    this.activeTab = tab;
    this.filterApplications();
    this.updateSlider(index);
  }

  updateSlider(index: number): void {
    if (this.tabElements && this.tabElements.length > 0) {
      const tabElement = this.tabElements.toArray()[index]?.nativeElement;
      if (tabElement) {
        this.sliderStyle = {
          left: `${tabElement.offsetLeft}px`,
          width: `${tabElement.offsetWidth}px`,
        };
      }
    }
  }

  onProfilePicError(app: ApplicationResponseDtoWithFallback): void {
    app.showInitialsFallback = true;
  }

  getTabCount(status: string): number {
    if (status === 'All') {
        return this.applications.length;
    }
    return this.applications.filter(app => app.status === status).length;
  }

  trackApplicationById(index: number, application: ApplicationResponseDto): string {
    return application.applicationId;
  }

  getInitials(fullName: string): string {
    const names = fullName.split(' ');
    const firstNameInitial = names[0] ? names[0].charAt(0) : '';
    const lastNameInitial = names.length > 1 ? names[names.length - 1].charAt(0) : '';
    return firstNameInitial + lastNameInitial;
  }

  openPreview(app: ApplicationResponseDto) {
    this.selectedApplication = app;
    this.isModalOpen = true;
    this.modalStateService.setModalState(true);
  }

  closePreview() {
    this.selectedApplication = null;
    this.isModalOpen = false;
    this.modalStateService.setModalState(false);
  }
}