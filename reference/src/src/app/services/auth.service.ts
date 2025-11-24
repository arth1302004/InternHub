import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, SignupData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$ = this.loadingSubject.asObservable();

  // Signals for modern Angular approach
  private userSignal = signal<User | null>(null);
  public user = computed(() => this.userSignal());
  public isAuthenticated = computed(() => !!this.userSignal());
  public isAdmin = computed(() => this.userSignal()?.role === 'admin');
  public isIntern = computed(() => this.userSignal()?.role === 'intern');

  constructor(private router: Router) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const savedUser = localStorage.getItem('intern_management_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.setUser(user);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        this.logout();
      }
    }
    this.loadingSubject.next(false);
  }

  async login(email: string, password: string): Promise<boolean> {
    this.loadingSubject.next(true);
    
    try {
      // Admin login
      if (email === 'admin' && password === 'admin@123') {
        const adminUser: User = {
          id: 'admin-001',
          email: 'admin@internhub.com',
          role: 'admin',
          name: 'Admin User'
        };
        this.setUser(adminUser);
        localStorage.setItem('intern_management_user', JSON.stringify(adminUser));
        this.router.navigate(['/admin']);
        return true;
      }

      // Intern login - check against stored interns
      const storedInterns = JSON.parse(localStorage.getItem('intern_management_interns') || '[]');
      const intern = storedInterns.find((i: any) => i.email === email && i.password === password);
      
      if (intern) {
        const internUser: User = {
          id: intern.id,
          email: intern.email,
          role: 'intern',
          name: intern.name,
          phone: intern.phone,
          university: intern.university,
          major: intern.major,
          graduationDate: intern.graduationDate,
          skills: intern.skills
        };
        this.setUser(internUser);
        localStorage.setItem('intern_management_user', JSON.stringify(internUser));
        this.router.navigate(['/intern']);
        return true;
      }

      return false;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  async signup(userData: SignupData): Promise<boolean> {
    this.loadingSubject.next(true);
    
    try {
      // Get existing interns
      const existingInterns = JSON.parse(localStorage.getItem('intern_management_interns') || '[]');
      
      // Check if email already exists
      if (existingInterns.some((intern: any) => intern.email === userData.email)) {
        return false;
      }

      // Create new intern
      const newIntern = {
        id: `intern-${Date.now()}`,
        ...userData,
        createdAt: new Date().toISOString(),
        status: 'pending',
        applications: [],
        tasks: [],
        evaluations: []
      };

      // Save to localStorage
      const updatedInterns = [...existingInterns, newIntern];
      localStorage.setItem('intern_management_interns', JSON.stringify(updatedInterns));
      
      // Update interns context if it exists
      const internsContext = localStorage.getItem('intern_management_context');
      if (internsContext) {
        const parsedContext = JSON.parse(internsContext);
        parsedContext.interns = updatedInterns;
        localStorage.setItem('intern_management_context', JSON.stringify(parsedContext));
      }

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      this.loadingSubject.next(false);
    }
  }

  logout(): void {
    this.setUser(null);
    localStorage.removeItem('intern_management_user');
    this.router.navigate(['/auth']);
  }

  private setUser(user: User | null): void {
    this.currentUserSubject.next(user);
    this.userSignal.set(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}