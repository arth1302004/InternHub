import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../service/application.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationResponseDto } from '../../models/application';
import { Router, RouterLink } from '@angular/router';
import { ApplicationPreview } from '../application-preview/application-preview';
import { ModalStateService } from '../../services/modal-state.service';

interface ApprovalStats {
  pendingApproval: number;
  approvedToday: number;
  totalHired: number;
  approvalRate: string;
}

interface PendingApproval {
  id: string;
  fullName: string;
  internshipRole: string;
  university: string;
  rating: string;
  hrRecommendation: string;
  profilePicUrl?: string;
  showInitialsFallback?: boolean;
}

interface RecentDecision {
  id: string;
  fullName: string;
  internshipRole: string;
  date: string;
  status: 'Approved' | 'Rejected';
  profilePicUrl?: string;
  showInitialsFallback?: boolean;
}

@Component({
  selector: 'app-admin-approval-center',
  standalone: true,
  imports: [CommonModule, ApplicationPreview, RouterLink],
  templateUrl: './admin-approval-center.component.html',
  styleUrls: ['./admin-approval-center.component.css']
})
export class AdminApprovalCenterComponent implements OnInit {
  applicationService = inject(ApplicationService);
  modalStateService = inject(ModalStateService);
  router = inject(Router);

  approvalStats: ApprovalStats = {
    pendingApproval: 0,
    approvedToday: 0,
    totalHired: 0,
    approvalRate: '0%'
  };

  pendingApprovals: PendingApproval[] = [];
  recentDecisions: RecentDecision[] = [];
  selectedApplication: ApplicationResponseDto | null = null;
  isModalOpen: boolean = false;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.applicationService.getAllApplications().subscribe({
      next: (apps: ApplicationResponseDto[]) => {
        const hiredApps = apps.filter(a => a.status === 'Hired');
        const rejectedApps = apps.filter(a => a.status === 'Rejected');
        const reviewApps = apps.filter(a => a.status === 'Review');

        const approvedTodayCount = hiredApps.filter(a => {
          const requestDate = new Date(a.requestDate);
          const today = new Date();
          return requestDate.getDate() === today.getDate() &&
                 requestDate.getMonth() === today.getMonth() &&
                 requestDate.getFullYear() === today.getFullYear();
        }).length;

        const totalDecisions = hiredApps.length + rejectedApps.length;
        const approvalRateValue = totalDecisions > 0 ? (hiredApps.length / totalDecisions) * 100 : 0;

        this.approvalStats = {
          pendingApproval: reviewApps.length,
          approvedToday: approvedTodayCount,
          totalHired: hiredApps.length,
          approvalRate: `${approvalRateValue.toFixed(0)}%`
        };

        this.pendingApprovals = reviewApps.map(a => ({
          id: a.applicationId,
          fullName: a.fullName,
          internshipRole: a.internshipRole,
          university: a.universityName,
          rating: '4/5', // Mock data
          hrRecommendation: 'Highly recommended candidate with previous internship experience.', // Mock data
          profilePicUrl: a.profilePicUrl,
          showInitialsFallback: false
        }));

        this.recentDecisions = [...hiredApps, ...rejectedApps]
          .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
          .slice(0, 5) // Get latest 5
          .map(a => ({
            id: a.applicationId,
            fullName: a.fullName,
            internshipRole: a.internshipRole,
            date: new Date(a.requestDate).toLocaleDateString(),
            status: a.status === 'Hired' ? 'Approved' : 'Rejected',
            profilePicUrl: a.profilePicUrl,
            showInitialsFallback: false
          }));
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching applications:', err);
      }
    });
  }

  onAdminReview(applicationId: string): void {
    this.applicationService.getApplicationById(applicationId).subscribe({
        next: (app: ApplicationResponseDto) => {
            this.selectedApplication = app;
            this.isModalOpen = true;
            this.modalStateService.setModalState(true);
        },
        error: (err: HttpErrorResponse) => {
            console.error('Error fetching application details:', err);
        }
    });
  }

  closePreview() {
    this.selectedApplication = null;
    this.isModalOpen = false;
    this.modalStateService.setModalState(false);
  }

  onProfilePicError(item: PendingApproval | RecentDecision): void {
    item.showInitialsFallback = true;
  }

  getInitials(fullName: string): string {
    const names = fullName.split(' ');
    const firstNameInitial = names[0] ? names[0].charAt(0) : '';
    const lastNameInitial = names.length > 1 ? names[names.length - 1].charAt(0) : '';
    return (firstNameInitial + lastNameInitial).toUpperCase();
  }
}
