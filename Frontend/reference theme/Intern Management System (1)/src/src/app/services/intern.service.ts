import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Intern } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class InternService {
  private internsSubject = new BehaviorSubject<Intern[]>([]);
  public interns$ = this.internsSubject.asObservable();

  // Signals
  private internsSignal = signal<Intern[]>([]);
  public interns = computed(() => this.internsSignal());
  public totalInterns = computed(() => this.internsSignal().length);
  public activeInterns = computed(() => this.internsSignal().filter(intern => intern.status === 'active').length);
  public completedInterns = computed(() => this.internsSignal().filter(intern => intern.status === 'completed').length);

  private initialInterns: Intern[] = [
    {
      id: 1,
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      phone: '+1 (555) 123-4567',
      department: 'Engineering',
      position: 'Software Developer Intern',
      startDate: '2025-01-15',
      mentor: 'John Smith',
      status: 'active',
      rating: 4.5,
      location: 'San Francisco, CA',
      university: 'Stanford University',
      avatar: 'SC'
    },
    {
      id: 2,
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@example.com',
      phone: '+1 (555) 234-5678',
      department: 'Marketing',
      position: 'Digital Marketing Intern',
      startDate: '2025-02-01',
      mentor: 'Emily Davis',
      status: 'active',
      rating: 4.2,
      location: 'New York, NY',
      university: 'Columbia University',
      avatar: 'AR'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      phone: '+1 (555) 345-6789',
      department: 'Design',
      position: 'UX Design Intern',
      startDate: '2024-12-01',
      mentor: 'Mike Johnson',
      status: 'active',
      rating: 4.8,
      location: 'Los Angeles, CA',
      university: 'UCLA',
      avatar: 'EW'
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@example.com',
      phone: '+1 (555) 456-7890',
      department: 'Data Science',
      position: 'Data Analyst Intern',
      startDate: '2024-11-15',
      mentor: 'Lisa Zhang',
      status: 'completed',
      rating: 4.3,
      location: 'Seattle, WA',
      university: 'University of Washington',
      avatar: 'DK'
    },
    {
      id: 5,
      name: 'Maya Patel',
      email: 'maya.patel@example.com',
      phone: '+1 (555) 567-8901',
      department: 'Engineering',
      position: 'Backend Developer Intern',
      startDate: '2025-01-08',
      mentor: 'Tom Wilson',
      status: 'active',
      rating: 4.6,
      location: 'Austin, TX',
      university: 'UT Austin',
      avatar: 'MP'
    },
    {
      id: 6,
      name: 'James Thompson',
      email: 'james.thompson@example.com',
      phone: '+1 (555) 678-9012',
      department: 'Product',
      position: 'Product Management Intern',
      startDate: '2025-02-15',
      mentor: 'Sarah Lee',
      status: 'onboarding',
      rating: null,
      location: 'Chicago, IL',
      university: 'Northwestern University',
      avatar: 'JT'
    }
  ];

  constructor() {
    this.initializeInterns();
  }

  private initializeInterns(): void {
    // Load from localStorage first, fallback to initialInterns
    const savedInterns = localStorage.getItem('intern_management_context');
    let interns = this.initialInterns;

    if (savedInterns) {
      try {
        const parsed = JSON.parse(savedInterns);
        interns = parsed.interns || this.initialInterns;
      } catch {
        interns = this.initialInterns;
      }
    } else {
      // Also load interns from the auth system
      const authInterns = localStorage.getItem('intern_management_interns');
      if (authInterns) {
        try {
          const parsedAuthInterns = JSON.parse(authInterns);
          // Convert auth interns to display format
          const convertedInterns = parsedAuthInterns.map((authIntern: any) => ({
            id: parseInt(authIntern.id.replace('intern-', '')) || Date.now(),
            name: authIntern.name,
            email: authIntern.email,
            phone: authIntern.phone,
            department: 'General',
            position: `${authIntern.major} Intern`,
            startDate: new Date().toISOString().split('T')[0],
            mentor: 'To be assigned',
            status: authIntern.status || 'onboarding',
            rating: null,
            location: 'Remote',
            university: authIntern.university,
            avatar: authIntern.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
          }));
          
          // Merge with initial interns, avoiding duplicates
          const allInterns = [...this.initialInterns];
          convertedInterns.forEach((authIntern: Intern) => {
            if (!allInterns.some(intern => intern.email === authIntern.email)) {
              allInterns.push(authIntern);
            }
          });
          
          interns = allInterns;
        } catch {
          interns = this.initialInterns;
        }
      }
    }

    this.setInterns(interns);
  }

  private setInterns(interns: Intern[]): void {
    this.internsSubject.next(interns);
    this.internsSignal.set(interns);
    this.saveToStorage(interns);
  }

  private saveToStorage(interns: Intern[]): void {
    localStorage.setItem('intern_management_context', JSON.stringify({ interns }));
  }

  addIntern(intern: Intern): void {
    const currentInterns = this.internsSignal();
    const updatedInterns = [...currentInterns, intern];
    this.setInterns(updatedInterns);
  }

  updateIntern(id: number, updates: Partial<Intern>): void {
    const currentInterns = this.internsSignal();
    const updatedInterns = currentInterns.map(intern => 
      intern.id === id ? { ...intern, ...updates } : intern
    );
    this.setInterns(updatedInterns);
  }

  deleteIntern(id: number): void {
    const currentInterns = this.internsSignal();
    const updatedInterns = currentInterns.filter(intern => intern.id !== id);
    this.setInterns(updatedInterns);
  }

  getInternById(id: number): Intern | undefined {
    return this.internsSignal().find(intern => intern.id === id);
  }

  getInternsByStatus(status: 'active' | 'completed' | 'onboarding'): Intern[] {
    return this.internsSignal().filter(intern => intern.status === status);
  }

  searchInterns(query: string): Intern[] {
    const searchTerm = query.toLowerCase();
    return this.internsSignal().filter(intern => 
      intern.name.toLowerCase().includes(searchTerm) ||
      intern.email.toLowerCase().includes(searchTerm) ||
      intern.department.toLowerCase().includes(searchTerm) ||
      intern.university.toLowerCase().includes(searchTerm)
    );
  }
}