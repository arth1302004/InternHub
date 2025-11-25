import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Interview {
    interviewId: string;
    applicationId: string;
    candidateName: string;
    candidateEmail: string;
    position: string;
    date: string;
    time: string;
    duration: number;
    type: 'Phone' | 'Video' | 'InPerson';
    location?: string;
    meetingLink?: string;
    interviewerName: string;
    interviewerEmail: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled' | 'NoShow';
    notes?: string;
    feedback?: string;
    rating?: number;
}

export interface CreateInterviewDto {
    applicationId: string;
    candidateName: string;
    candidateEmail: string;
    position: string;
    date: string;
    time: string;
    duration: number;
    type: string;
    location?: string;
    meetingLink?: string;
    interviewerName: string;
    interviewerEmail: string;
    notes?: string;
}

export interface UpdateInterviewDto {
    date?: string;
    time?: string;
    duration?: number;
    type?: string;
    location?: string;
    meetingLink?: string;
    status?: string;
    notes?: string;
    feedback?: string;
    rating?: number;
}

@Injectable({
    providedIn: 'root'
})
export class InterviewService {
    private apiUrl = 'http://localhost:5101/api/interview';

    constructor(private http: HttpClient) { }

    getAllInterviews(): Observable<Interview[]> {
        return this.http.get<Interview[]>(this.apiUrl);
    }

    getInterviewById(id: string): Observable<Interview> {
        return this.http.get<Interview>(`${this.apiUrl}/${id}`);
    }

    getInterviewsByApplicationId(applicationId: string): Observable<Interview[]> {
        return this.http.get<Interview[]>(`${this.apiUrl}/application/${applicationId}`);
    }

    createInterview(interview: CreateInterviewDto): Observable<Interview> {
        return this.http.post<Interview>(this.apiUrl, interview);
    }

    updateInterview(id: string, interview: UpdateInterviewDto): Observable<Interview> {
        return this.http.put<Interview>(`${this.apiUrl}/${id}`, interview);
    }

    deleteInterview(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
