import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedList } from '../models/paged-list';
import { AttendanceRecord } from '../models/attendance-record';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  http = inject(HttpClient)

  private baseUrl = 'http://localhost:5101';

  GetAllAttendance(pageNumber: number, pageSize: number): Observable<PagedList<AttendanceRecord>> {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<PagedList<AttendanceRecord>>(`${this.baseUrl}/api/attendance`, { params: params });
  }

  GetAttendanceByIntern(userId: string, pageNumber: number, pageSize: number): Observable<PagedList<AttendanceRecord>> {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<PagedList<AttendanceRecord>>(`${this.baseUrl}/api/attendance/${userId}`, { params: params })
  }
}