import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProjectInterface {
    projectId: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    startDate: string;
    endDate: string;
    progress: number;
    budget: number;
    spent: number;
    teamLead?: string;
    department?: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    assignedInternIds: string[];
    tasks: {
        total: number;
        completed: number;
        inProgress: number;
        pending: number;
    };
}

export interface CreateProjectInterface {
    title: string;
    description: string;
    status: string;
    priority: string;
    startDate: string;
    endDate: string;
    budget: number;
    teamLead?: string;
    department?: string;
    tags?: string[];
}

export interface UpdateProjectInterface {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    startDate?: string;
    endDate?: string;
    progress?: number;
    budget?: number;
    spent?: number;
    teamLead?: string;
    department?: string;
    tags?: string[];
}

export interface ProjectStatsInterface {
    total: number;
    active: number;
    completed: number;
    onHold: number;
    planning: number;
    cancelled: number;
    totalBudget: number;
    totalSpent: number;
}

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private apiUrl = 'http://localhost:5101/api/Projects';

    constructor(private http: HttpClient) { }

    getAllProjects(): Observable<ProjectInterface[]> {
        return this.http.get<ProjectInterface[]>(this.apiUrl);
    }

    getProjectById(id: string): Observable<ProjectInterface> {
        return this.http.get<ProjectInterface>(`${this.apiUrl}/${id}`);
    }

    getProjectStats(): Observable<ProjectStatsInterface> {
        return this.http.get<ProjectStatsInterface>(`${this.apiUrl}/stats`);
    }

    createProject(project: CreateProjectInterface): Observable<ProjectInterface> {
        return this.http.post<ProjectInterface>(this.apiUrl, project);
    }

    updateProject(id: string, project: UpdateProjectInterface): Observable<ProjectInterface> {
        return this.http.put<ProjectInterface>(`${this.apiUrl}/${id}`, project);
    }

    deleteProject(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    assignInternToProject(projectId: string, internId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/${projectId}/interns/${internId}`, {});
    }

    removeInternFromProject(projectId: string, internId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${projectId}/interns/${internId}`);
    }

    updateProjectProgress(id: string, progress: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/progress`, progress);
    }
}
