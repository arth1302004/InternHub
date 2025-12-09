import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAdmin } from '../models/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  http = inject(HttpClient)

  private baseUrl = 'http://localhost:5101';

  GetAdminById(adminId: string): Observable<any> {
    return this.http.get<IAdmin>(`${this.baseUrl}/api/Admin/${adminId}`)
  }

  UpdateAdmin(adminId: string, formData: FormData): Observable<IAdmin> {
    return this.http.put<IAdmin>(`${this.baseUrl}/api/Admin/${adminId}`, formData);
  }
}
