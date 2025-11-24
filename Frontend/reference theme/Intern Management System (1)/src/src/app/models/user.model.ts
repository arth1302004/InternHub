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

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  university: string;
  major: string;
  graduationDate: string;
  skills: string[];
}

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