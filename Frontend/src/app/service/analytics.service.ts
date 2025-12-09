import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface AnalyticsStats {
  activeInterns: number;
  activeInternsChange: number;
  averagePerformance: number;
  averagePerformanceChange: number;
  taskCompletionRate: number;
  taskCompletionRateChange: number;
  totalApplications: number;
  applicationsChange: number;
}

export interface PerformanceData {
  month: string;
  rating: number;
  tasks: number;
  applications: number;
}

export interface DepartmentDistribution {
  name: string;
  value: number;
  color: string;
}

export interface TaskCompletionData {
  week: string;
  completed: number;
  total: number;
}

export interface ApplicationTrend {
  month: string;
  applications: number;
  accepted: number;
  rejected: number;
  pending: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:5101';

  constructor(private http: HttpClient) { }

  getAnalyticsStats(): Observable<AnalyticsStats> {
    return this.http.get<AnalyticsStats>(`${this.apiUrl}/stats`);
  }

  getPerformanceTrends(months: number = 6): Observable<PerformanceData[]> {
    return this.http.get<PerformanceData[]>(`${this.apiUrl}/performance-trends?months=${months}`);
  }

  getDepartmentDistribution(): Observable<DepartmentDistribution[]> {
    return this.http.get<DepartmentDistribution[]>(`${this.apiUrl}/department-distribution`);
  }

  getTaskCompletionData(weeks: number = 6): Observable<TaskCompletionData[]> {
    return this.http.get<TaskCompletionData[]>(`${this.apiUrl}/task-completion?weeks=${weeks}`);
  }

  getApplicationTrends(months: number = 6): Observable<ApplicationTrend[]> {
    return this.http.get<ApplicationTrend[]>(`${this.apiUrl}/application-trends?months=${months}`);
  }
}
