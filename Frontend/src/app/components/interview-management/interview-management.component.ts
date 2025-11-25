import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterviewService, Interview, CreateInterviewDto, UpdateInterviewDto } from '../../services/interview.service';

@Component({
    selector: 'app-interview-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './interview-management.component.html'
})
export class InterviewManagementComponent implements OnInit {
    interviews: Interview[] = [];
    upcomingInterviews: Interview[] = [];
    completedInterviews: Interview[] = [];

    showScheduleModal = false;
    showDetailsModal = false;
    selectedInterview: Interview | null = null;

    // Form data for scheduling
    newInterview: CreateInterviewDto = {
        applicationId: '', // This would ideally come from a selection or be pre-filled
        candidateName: '',
        candidateEmail: '',
        position: '',
        date: '',
        time: '',
        duration: 60,
        type: 'Video',
        location: '',
        meetingLink: '',
        interviewerName: '',
        interviewerEmail: '',
        notes: ''
    };

    // Form data for details/feedback
    feedbackData = {
        feedback: '',
        rating: 0,
        nextSteps: '',
        status: ''
    };

    constructor(private interviewService: InterviewService) { }

    ngOnInit() {
        this.loadInterviews();
    }

    loadInterviews() {
        this.interviewService.getAllInterviews().subscribe({
            next: (data) => {
                this.interviews = data;
                this.upcomingInterviews = data.filter(i => i.status === 'Scheduled');
                this.completedInterviews = data.filter(i => i.status !== 'Scheduled');
            },
            error: (err) => console.error('Error loading interviews:', err)
        });
    }

    openScheduleModal() {
        this.showScheduleModal = true;
        // Reset form
        this.newInterview = {
            applicationId: '',
            candidateName: '',
            candidateEmail: '',
            position: '',
            date: '',
            time: '',
            duration: 60,
            type: 'Video',
            location: '',
            meetingLink: '',
            interviewerName: '',
            interviewerEmail: '',
            notes: ''
        };
    }

    closeScheduleModal() {
        this.showScheduleModal = false;
    }

    scheduleInterview() {
        // In a real app, you'd select an application first to get ID and candidate details
        // For this standalone demo, we might need to mock or manually enter applicationId
        if (!this.newInterview.applicationId) {
            // For testing/demo purposes if we don't have a way to select application yet
            // We might just let it fail or require user to input a GUID
            // Or better, fetch applications to select from. 
            // For now, let's assume the user inputs it or we handle it gracefully.
        }

        this.interviewService.createInterview(this.newInterview).subscribe({
            next: () => {
                this.loadInterviews();
                this.closeScheduleModal();
            },
            error: (err) => console.error('Error scheduling interview:', err)
        });
    }

    openDetailsModal(interview: Interview) {
        this.selectedInterview = interview;
        this.feedbackData = {
            feedback: interview.feedback || '',
            rating: interview.rating || 0,
            nextSteps: '', // Not in entity yet, maybe add to notes?
            status: interview.status
        };
        this.showDetailsModal = true;
    }

    closeDetailsModal() {
        this.showDetailsModal = false;
        this.selectedInterview = null;
    }

    updateInterviewStatus(status: string) {
        if (!this.selectedInterview) return;

        const updateDto: UpdateInterviewDto = {
            status: status
        };

        this.interviewService.updateInterview(this.selectedInterview.interviewId, updateDto).subscribe({
            next: () => {
                if (this.selectedInterview) this.selectedInterview.status = status as any;
                this.loadInterviews();
            },
            error: (err) => console.error('Error updating status:', err)
        });
    }

    saveFeedback() {
        if (!this.selectedInterview) return;

        const updateDto: UpdateInterviewDto = {
            feedback: this.feedbackData.feedback,
            rating: this.feedbackData.rating,
            status: this.selectedInterview.status === 'Scheduled' ? 'Completed' : this.selectedInterview.status
        };

        this.interviewService.updateInterview(this.selectedInterview.interviewId, updateDto).subscribe({
            next: () => {
                this.loadInterviews();
                this.closeDetailsModal();
            },
            error: (err) => console.error('Error saving feedback:', err)
        });
    }

    // Helper for rating stars
    setRating(rating: number) {
        this.feedbackData.rating = rating;
    }
}
