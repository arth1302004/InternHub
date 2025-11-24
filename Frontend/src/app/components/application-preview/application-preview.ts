import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { ApplicationResponseDto, UpdateApplicationStatusDto } from '../../models/application';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../service/application.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

export interface TimelineStep {
  title: string;
  subtitle: string;
  details?: string;
  isCompleted: boolean;
  isCurrent: boolean;
  icon?: string;
}

@Component({
  selector: 'app-application-preview',
  imports: [CommonModule, FormsModule],
  templateUrl: './application-preview.html',
  styleUrls: ['./application-preview.css'],
  standalone: true,
})
export class ApplicationPreview implements OnChanges {
  @Input() selectedApplication: ApplicationResponseDto | null = null;
  @Output() close = new EventEmitter<void>();

  applicationService = inject(ApplicationService);
  timeline: TimelineStep[] = [];
  timelineDuration: number = 0;
  nextStep: string = 'N/A';
  userRole: string | null = null;
  decisionStep: 'initial' | 'approve' | 'reject' = 'initial';
  approvalNotes: string = '';
  rejectionReason: string = '';

  constructor() {
    this.userRole = localStorage.getItem('role');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedApplication'] && this.selectedApplication) {
      this.generateTimeline();
      this.calculateDuration();
      this.determineNextStep();
    }
  }

  closePreview(): void {
    this.close.emit();
  }

  setDecisionStep(step: 'approve' | 'reject') {
    this.decisionStep = step;
  }

  confirmApproval(): void {
    if (this.selectedApplication) {
      const statusDto: UpdateApplicationStatusDto = { status: 'Hired' };
      this.applicationService.updateApplicationStatus(this.selectedApplication.applicationId, statusDto).subscribe({
        next: () => {
          Swal.fire('Success', 'Application approved and intern hired!', 'success');
          this.close.emit();
        },
        error: (err) => {
          console.error('Error updating application status', err);
          Swal.fire('Error', 'Failed to update application status', 'error');
        }
      });
    }
  }

  confirmRejection(): void {
    if (this.selectedApplication) {
      const statusDto: UpdateApplicationStatusDto = { status: 'Rejected' };
      this.applicationService.updateApplicationStatus(this.selectedApplication.applicationId, statusDto).subscribe({
        next: () => {
          Swal.fire('Success', 'Application rejected!', 'success');
          this.close.emit();
        },
        error: (err) => {
          console.error('Error updating application status', err);
          Swal.fire('Error', 'Failed to update application status', 'error');
        }
      });
    }
  }

  private generateTimeline(): void {
    if (!this.selectedApplication) {
      this.timeline = [];
      return;
    }

    const status = this.selectedApplication.status;
    const allSteps: Omit<TimelineStep, 'isCompleted' | 'isCurrent'>[] = [
      { title: 'Application Submitted', subtitle: 'Candidate has submitted their application', details: 'Application submitted successfully' },
      { title: 'Under Review', subtitle: 'HR team is reviewing the application', details: 'Initial application review started' },
      { title: 'Interview Scheduled', subtitle: 'Has been scheduled with candidate', details: 'Phone interview scheduled for Jan 18, 2PM' },
      { title: 'Interview Completed', subtitle: 'Interview has been completed, awaiting HR decision', details: 'Interview completed successfully' },
      { title: 'HR Approved', subtitle: 'HR has approved, pending final admin approval', details: 'HR recommendation: Strong candidate' },
      { title: 'Hired', subtitle: 'Candidate has been hired', details: 'Offer letter sent' }
    ];

    const statusOrder = ['Submitted', 'Review', 'Interview', 'Completed', 'Approved', 'Hired'];
    const currentIndex = statusOrder.indexOf(status);

    this.timeline = allSteps.map((step, index) => ({
      ...step,
      isCompleted: index < currentIndex,
      isCurrent: index === currentIndex,
    }));
  }

  private calculateDuration(): void {
    if (this.selectedApplication) {
      const startDate = new Date(this.selectedApplication.requestDate);
      const endDate = new Date(); // Today
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      this.timelineDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }

  private determineNextStep(): void {
    if (!this.selectedApplication) {
      this.nextStep = 'N/A';
      return;
    }

    switch (this.selectedApplication.status) {
      case 'Submitted':
        this.nextStep = 'HR team will review the application within 2-3 business days';
        break;
      case 'Review':
        this.nextStep = 'Schedule an interview with the candidate';
        break;
      case 'Interview':
        this.nextStep = 'Complete the interview and await HR decision';
        break;
      case 'Completed':
        this.nextStep = 'HR to make a final recommendation';
        break;
      case 'Approved':
        this.nextStep = 'Admin will review HR recommendation and make final decision';
        break;
      case 'Hired':
        this.nextStep = 'Onboarding process to begin';
        break;
      default:
        this.nextStep = 'N/A';
        break;
    }
  }
}