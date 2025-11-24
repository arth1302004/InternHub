import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.loggedIn.asObservable();

  http = inject(HttpClient);

  private baseUrl = 'https://localhost:7140';

  UserLogin(userCreds: IUser): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/Login/login`, userCreds).pipe(
      tap(() => this.loggedIn.next(true))
    );
  }

  validateToken(): Observable<boolean> {
    const token = this.getToken();
    const userId = this.getUserId();
    const userRole = this.getUserRole();

    if (!token || !userId || !userRole) {
      return of(false);
    }

    // Admins might have a different validation endpoint, or we can use a generic one.
    // For this case, we assume validation can be done by fetching the user's own data.
    const validationUrl = userRole === 'admin' 
      ? `${this.baseUrl}/api/intern` // A generic protected endpoint for admin
      : `${this.baseUrl}/api/intern/${userId}`; // Fetch intern's own data

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(validationUrl, { headers, observe: 'response' }).pipe(
      map(response => response.status === 200),
      catchError(() => of(false))
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    this.loggedIn.next(false);
  }

  notifyProfileUpdate(): void {
    this.loggedIn.next(true);
  }
}
