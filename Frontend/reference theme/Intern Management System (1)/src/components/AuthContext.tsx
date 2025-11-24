import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'intern';
  name: string;
  // Additional fields for interns
  phone?: string;
  university?: string;
  major?: string;
  graduationDate?: string;
  skills?: string[];
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  university: string;
  major: string;
  graduationDate: string;
  skills: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('intern_management_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Admin login
    if (email === 'admin' && password === 'admin@123') {
      const adminUser: User = {
        id: 'admin-001',
        email: 'admin@internhub.com',
        role: 'admin',
        name: 'Admin User'
      };
      setUser(adminUser);
      localStorage.setItem('intern_management_user', JSON.stringify(adminUser));
      setLoading(false);
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
      setUser(internUser);
      localStorage.setItem('intern_management_user', JSON.stringify(internUser));
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Get existing interns
      const existingInterns = JSON.parse(localStorage.getItem('intern_management_interns') || '[]');
      
      // Check if email already exists
      if (existingInterns.some((intern: any) => intern.email === userData.email)) {
        setLoading(false);
        return false;
      }

      // Create new intern
      const newIntern = {
        id: `intern-${Date.now()}`,
        ...userData,
        createdAt: new Date().toISOString(),
        status: 'pending', // Default status for new signups
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

      setLoading(false);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('intern_management_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};