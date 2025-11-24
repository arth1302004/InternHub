import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Intern {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  startDate: string;
  mentor: string;
  status: 'active' | 'completed' | 'onboarding';
  rating: number | null;
  location: string;
  university: string;
  avatar: string;
}

interface InternContextType {
  interns: Intern[];
  addIntern: (intern: Intern) => void;
  updateIntern: (id: number, updates: Partial<Intern>) => void;
  deleteIntern: (id: number) => void;
}

const InternContext = createContext<InternContextType | undefined>(undefined);

const initialInterns: Intern[] = [
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

export function InternProvider({ children }: { children: ReactNode }) {
  const [interns, setInterns] = useState<Intern[]>(() => {
    // Load from localStorage first, fallback to initialInterns
    const savedInterns = localStorage.getItem('intern_management_context');
    if (savedInterns) {
      try {
        const parsed = JSON.parse(savedInterns);
        return parsed.interns || initialInterns;
      } catch {
        return initialInterns;
      }
    }
    
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
          department: 'General', // Default department
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
        const allInterns = [...initialInterns];
        convertedInterns.forEach((authIntern: Intern) => {
          if (!allInterns.some(intern => intern.email === authIntern.email)) {
            allInterns.push(authIntern);
          }
        });
        
        return allInterns;
      } catch {
        return initialInterns;
      }
    }
    
    return initialInterns;
  });

  // Save to localStorage whenever interns change
  React.useEffect(() => {
    localStorage.setItem('intern_management_context', JSON.stringify({ interns }));
  }, [interns]);

  const addIntern = (intern: Intern) => {
    setInterns(prev => {
      const newInterns = [...prev, intern];
      localStorage.setItem('intern_management_context', JSON.stringify({ interns: newInterns }));
      return newInterns;
    });
  };

  const updateIntern = (id: number, updates: Partial<Intern>) => {
    setInterns(prev => {
      const updatedInterns = prev.map(intern => 
        intern.id === id ? { ...intern, ...updates } : intern
      );
      localStorage.setItem('intern_management_context', JSON.stringify({ interns: updatedInterns }));
      return updatedInterns;
    });
  };

  const deleteIntern = (id: number) => {
    setInterns(prev => {
      const filteredInterns = prev.filter(intern => intern.id !== id);
      localStorage.setItem('intern_management_context', JSON.stringify({ interns: filteredInterns }));
      return filteredInterns;
    });
  };

  return (
    <InternContext.Provider value={{ interns, addIntern, updateIntern, deleteIntern }}>
      {children}
    </InternContext.Provider>
  );
}

export function useInterns() {
  const context = useContext(InternContext);
  if (context === undefined) {
    throw new Error('useInterns must be used within an InternProvider');
  }
  return context;
}