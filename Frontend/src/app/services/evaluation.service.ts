import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PerformanceAreas {
  technicalSkills: number;
  communication: number;
  problemSolving: number;
}

export interface Evaluation {
  internName: string;
  quarter: string;
  status: string;
  evaluator: string;
  date: string;
  overallRating: number;
  performanceAreas: PerformanceAreas;
  internInitials: string;
}

export interface EvaluationStats {
  completed: number;
  inProgress: number;
  scheduled: number;
  avgRating: number;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = '/api/evaluation';

  constructor(private http: HttpClient) { }

  getEvaluationStats(): Observable<EvaluationStats> {
    return this.http.get<EvaluationStats>(`${this.apiUrl}/stats`);
  }

  getEvaluations(status: string): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}?status=${status}`);
  }
}
