import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationResponseDto, CreateApplicationDto, UpdateApplicationDto, UpdateApplicationStatusDto } from '../models/application';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5101/api/Applications'; // Adjust base URL as needed

  getAllApplications(): Observable<ApplicationResponseDto[]> {
    return this.http.get<ApplicationResponseDto[]>(this.baseUrl);
  }

  getApplicationById(id: string): Observable<ApplicationResponseDto> {
    return this.http.get<ApplicationResponseDto>(`${this.baseUrl}/${id}`);
  }

  createApplication(createDto: CreateApplicationDto): Observable<ApplicationResponseDto> {
    const formData = new FormData();
    for (const key in createDto) {
      if (Object.prototype.hasOwnProperty.call(createDto, key)) {
        const value = (createDto as any)[key];
        if (value instanceof File) {
          formData.append(key, value, value.name);
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      }
    }
    return this.http.post<ApplicationResponseDto>(this.baseUrl, formData);
  }

  updateApplication(id: string, updateDto: UpdateApplicationDto): Observable<ApplicationResponseDto> {
    return this.http.put<ApplicationResponseDto>(`${this.baseUrl}/${id}`, updateDto);
  }

  deleteApplication(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateApplicationStatus(id: string, statusDto: UpdateApplicationStatusDto): Observable<ApplicationResponseDto> {
    return this.http.patch<ApplicationResponseDto>(`${this.baseUrl}/${id}/status`, statusDto);
  }
}
