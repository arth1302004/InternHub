import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IIntern } from '../models/intern';
import { PagedList } from '../models/paged-list';
import { Login } from '../components/login/login';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root'
})
export class InternService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5101';

  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/intern/send-otp`, { email });
  }

  validateOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/intern/validate-otp`, { email, otp });
  }

  sendRegistrationLink(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/intern/send-application-link`, { email });
  }

  GetAllInterns(pageNumber: number, pageSize: number, searchString?: string, sortBy?: string, sortOrder?: string, department?: string, status?: string): Observable<PagedList<IIntern>> {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    if (searchString) {
      params = params.append('searchString', searchString);
    }
    if (sortBy) {
      params = params.append('sortBy', sortBy);
    }
    if (sortOrder) {
      params = params.append('sortOrder', sortOrder);
    }
    if (department) {
      params = params.append('department', department);
    }
    if (status) {
      params = params.append('status', status);
    }
    console.log("this method was executed with pagination and search");
    return this.http.get<PagedList<IIntern>>(`${this.baseUrl}/api/intern`, { params: params });
  }
  GetInternById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/api/intern/${id}`);
  }

  UpdateIntern(id: string, dataToUpdate: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/api/intern/${id}`, dataToUpdate)
  }
  AddIntern(intern: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/intern/AddIntern`, intern);
  }
  DeleteIntern(internId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/api/intern/${internId}`);
  }
  MarkAttendance(internId: string, status: any): Observable<any> {
    console.log(internId)
    return this.http.post<any>(`${this.baseUrl}/api/attendance/${internId}`, status)
  }

  verifyPassword(id: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/intern/verify-password/${id}`, { Password: password }, { responseType: 'text' });
  }

  resetPassword(id: string, passwords: { password: string, confirmPassword: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/intern/reset-password/${id}`, passwords, { responseType: 'text' });
  }

  resetPasswordWithToken(token: string, passwords: { password: string, confirmPassword: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Login/reset-password?token=${token}`, passwords, { responseType: 'text' });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/Login/forgot-password`, { email });
  }

  setSecurityQuestions(internId: string, questions: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/intern/${internId}/security-questions`, questions, { responseType: 'text' });
  }

  getSecurityQuestions(internId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/intern/${internId}/security-questions`);
  }

  getAllSecurityQuestions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/intern/all-security-questions`);
  }

  verifySecurityQuestions(questions: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/intern/verify-security-questions`, questions);
  }

  getUserIdFromResetToken(token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/Login/get-user-id-from-token?token=${token}`);
  }

}