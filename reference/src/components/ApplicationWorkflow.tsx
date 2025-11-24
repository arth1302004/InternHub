import React, { createContext, useContext, useState, useEffect } from 'react';

// Application Status Flow:
// 1. submitted -> HR reviews
// 2. under_review -> HR processing
// 3. interview_scheduled -> HR schedules interview
// 4. interview_completed -> HR completes interview
// 5. hr_approved -> HR approves, needs Admin approval
// 6. admin_approved -> Admin final approval (becomes hired)
// 7. hired -> Full access granted
// Alternative paths: hr_rejected, admin_rejected

export type ApplicationStatus = 
  | 'submitted'           // Initial application
  | 'under_review'        // HR is reviewing
  | 'interview_scheduled' // HR scheduled interview
  | 'interview_completed' // Interview done, awaiting HR decision
  | 'hr_approved'         // HR approved, needs Admin approval
  | 'hr_rejected'         // HR rejected
  | 'admin_approved'      // Admin approved (final)
  | 'admin_rejected'      // Admin rejected
  | 'hired';              // Successfully hired

export interface ApplicationWorkflowStep {
  status: ApplicationStatus;
  timestamp: string;
  actor: string; // Who performed this action
  actorRole: 'system' | 'hr' | 'admin';
  notes?: string;
  metadata?: any;
}

export interface ApplicationRecord {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  graduationDate: string;
  skills: string[];
  position: string;
  currentStatus: ApplicationStatus;
  workflow: ApplicationWorkflowStep[];
  submissionDate: string;
  hrReviewer?: string;
  adminReviewer?: string;
  interviewDate?: string;
  interviewFeedback?: string;
  interviewRating?: number;
  hrNotes?: string;
  adminNotes?: string;
  rejectionReason?: string;
  
  // Documents
  resume?: string;
  coverLetter?: string;
  portfolio?: string;
  
  // Metadata
  priority?: 'low' | 'normal' | 'high';
  tags?: string[];
  source?: string;
  metadata?: any; // Store additional data like original password
}

interface ApplicationWorkflowContextType {
  applications: ApplicationRecord[];
  updateApplicationStatus: (
    applicationId: string, 
    newStatus: ApplicationStatus, 
    actor: string, 
    actorRole: 'hr' | 'admin',
    notes?: string,
    metadata?: any
  ) => void;
  getApplicationsByStatus: (status: ApplicationStatus) => ApplicationRecord[];
  getApplicationsForRole: (role: 'hr' | 'admin') => {
    pending: ApplicationRecord[];
    total: ApplicationRecord[];
  };
  createApplication: (applicationData: Partial<ApplicationRecord>) => string;
  getApplicationWorkflow: (applicationId: string) => ApplicationWorkflowStep[] | null;
  canTransition: (currentStatus: ApplicationStatus, newStatus: ApplicationStatus, role: 'hr' | 'admin') => boolean;
}

const ApplicationWorkflowContext = createContext<ApplicationWorkflowContextType | undefined>(undefined);

// Define valid status transitions for each role
const STATUS_TRANSITIONS: Record<'hr' | 'admin', Record<ApplicationStatus, ApplicationStatus[]>> = {
  hr: {
    submitted: ['under_review', 'hr_rejected'],
    under_review: ['interview_scheduled', 'hr_rejected'],
    interview_scheduled: ['interview_completed', 'hr_rejected'],
    interview_completed: ['hr_approved', 'hr_rejected'],
    hr_approved: [], // Can't change once HR approved, needs Admin
    hr_rejected: [], // Final state for HR
    admin_approved: [], // Read-only for HR
    admin_rejected: [], // Read-only for HR
    hired: [] // Read-only for HR
  },
  admin: {
    submitted: ['under_review', 'admin_rejected'], // Admin can fast-track
    under_review: ['interview_scheduled', 'admin_rejected'],
    interview_scheduled: ['interview_completed', 'admin_rejected'],
    interview_completed: ['hr_approved', 'admin_rejected'],
    hr_approved: ['admin_approved', 'admin_rejected'], // Main Admin decision point
    hr_rejected: ['under_review', 'admin_rejected'], // Admin can override HR rejection
    admin_approved: ['hired'], // Admin approves -> hired
    admin_rejected: [], // Final state
    hired: [] // Final state
  }
};

export const useApplicationWorkflow = () => {
  const context = useContext(ApplicationWorkflowContext);
  if (context === undefined) {
    throw new Error('useApplicationWorkflow must be used within an ApplicationWorkflowProvider');
  }
  return context;
};

export const ApplicationWorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);

  // Load applications from localStorage on mount
  useEffect(() => {
    const savedApplications = localStorage.getItem('intern_management_applications');
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    } else {
      // Initialize with sample data for demo
      const sampleApplications: ApplicationRecord[] = [
        {
          id: 'app-001',
          candidateName: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 123-4567',
          university: 'Stanford University',
          major: 'Computer Science',
          graduationDate: '2024-05-15',
          skills: ['React', 'Python', 'JavaScript', 'Machine Learning'],
          position: 'Software Engineering Intern',
          currentStatus: 'submitted',
          submissionDate: '2024-01-15T09:00:00Z',
          workflow: [
            {
              status: 'submitted',
              timestamp: '2024-01-15T09:00:00Z',
              actor: 'System',
              actorRole: 'system',
              notes: 'Application submitted successfully'
            }
          ],
          priority: 'normal',
          tags: ['new-grad', 'stanford'],
          source: 'university-portal'
        },
        {
          id: 'app-002',
          candidateName: 'Mike Chen',
          email: 'mike.chen@email.com',
          phone: '+1 (555) 987-6543',
          university: 'MIT',
          major: 'Computer Science',
          graduationDate: '2024-06-10',
          skills: ['Java', 'Python', 'React', 'AWS'],
          position: 'Software Engineering Intern',
          currentStatus: 'hr_approved',
          submissionDate: '2024-01-12T10:30:00Z',
          hrReviewer: 'HR Manager',
          interviewDate: '2024-01-18T14:00:00Z',
          interviewFeedback: 'Strong technical background and excellent communication skills.',
          interviewRating: 4,
          hrNotes: 'Highly recommended candidate with previous internship experience.',
          workflow: [
            {
              status: 'submitted',
              timestamp: '2024-01-12T10:30:00Z',
              actor: 'System',
              actorRole: 'system'
            },
            {
              status: 'under_review',
              timestamp: '2024-01-12T15:00:00Z',
              actor: 'HR Manager',
              actorRole: 'hr',
              notes: 'Initial application review started'
            },
            {
              status: 'interview_scheduled',
              timestamp: '2024-01-15T11:00:00Z',
              actor: 'HR Manager',
              actorRole: 'hr',
              notes: 'Phone interview scheduled for Jan 18, 2PM'
            },
            {
              status: 'interview_completed',
              timestamp: '2024-01-18T15:00:00Z',
              actor: 'HR Manager',
              actorRole: 'hr',
              notes: 'Interview completed successfully'
            },
            {
              status: 'hr_approved',
              timestamp: '2024-01-18T16:00:00Z',
              actor: 'HR Manager',
              actorRole: 'hr',
              notes: 'HR recommendation: HIRE - Strong candidate'
            }
          ],
          priority: 'high',
          tags: ['mit', 'experienced'],
          source: 'linkedin'
        }
      ];
      
      setApplications(sampleApplications);
      localStorage.setItem('intern_management_applications', JSON.stringify(sampleApplications));
    }
  }, []);

  // Save applications to localStorage whenever applications change
  useEffect(() => {
    localStorage.setItem('intern_management_applications', JSON.stringify(applications));
  }, [applications]);

  const canTransition = (currentStatus: ApplicationStatus, newStatus: ApplicationStatus, role: 'hr' | 'admin'): boolean => {
    const allowedTransitions = STATUS_TRANSITIONS[role][currentStatus] || [];
    return allowedTransitions.includes(newStatus);
  };

  const updateApplicationStatus = (
    applicationId: string,
    newStatus: ApplicationStatus,
    actor: string,
    actorRole: 'hr' | 'admin',
    notes?: string,
    metadata?: any
  ) => {
    setApplications(prevApplications => {
      const updatedApplications = prevApplications.map(app => {
        if (app.id === applicationId) {
          // Validate transition
          if (!canTransition(app.currentStatus, newStatus, actorRole)) {
            console.error(`Invalid transition from ${app.currentStatus} to ${newStatus} for role ${actorRole}`);
            return app;
          }

          const newWorkflowStep: ApplicationWorkflowStep = {
            status: newStatus,
            timestamp: new Date().toISOString(),
            actor,
            actorRole,
            notes,
            metadata
          };

          const updatedApp = {
            ...app,
            currentStatus: newStatus,
            workflow: [...app.workflow, newWorkflowStep]
          };

          // Update reviewer fields
          if (actorRole === 'hr' && !updatedApp.hrReviewer) {
            updatedApp.hrReviewer = actor;
          }
          if (actorRole === 'admin' && !updatedApp.adminReviewer) {
            updatedApp.adminReviewer = actor;
          }

          // Handle special status updates
          if (newStatus === 'hr_rejected' || newStatus === 'admin_rejected') {
            updatedApp.rejectionReason = notes;
          }

          // Auto-transition from admin_approved to hired
          if (newStatus === 'admin_approved') {
            const hiredStep: ApplicationWorkflowStep = {
              status: 'hired',
              timestamp: new Date().toISOString(),
              actor: 'System',
              actorRole: 'system',
              notes: 'Automatically hired after admin approval'
            };
            
            updatedApp.currentStatus = 'hired';
            updatedApp.workflow.push(hiredStep);

            // Create intern account in the system
            const existingInterns = JSON.parse(localStorage.getItem('intern_management_interns') || '[]');
            
            // Check if intern account already exists
            const existingIntern = existingInterns.find((intern: any) => intern.email === updatedApp.email);
            
            if (!existingIntern) {
              const newIntern = {
                id: `intern-${Date.now()}`,
                name: updatedApp.candidateName,
                email: updatedApp.email,
                phone: updatedApp.phone,
                university: updatedApp.university,
                major: updatedApp.major,
                graduationDate: updatedApp.graduationDate,
                skills: updatedApp.skills,
                // Use the original password from signup, fallback to default if not found
                password: updatedApp.metadata?.originalPassword || 'intern123',
                createdAt: new Date().toISOString(),
                status: 'active',
                applications: [applicationId],
                tasks: [],
                evaluations: []
              };
              
              const updatedInterns = [...existingInterns, newIntern];
              localStorage.setItem('intern_management_interns', JSON.stringify(updatedInterns));
            } else {
              // Update existing intern to active status if needed
              const updatedInterns = existingInterns.map((intern: any) => {
                if (intern.email === updatedApp.email) {
                  return {
                    ...intern,
                    status: 'active',
                    applications: [...(intern.applications || []), applicationId]
                  };
                }
                return intern;
              });
              localStorage.setItem('intern_management_interns', JSON.stringify(updatedInterns));
            }

          }

          return updatedApp;
        }
        return app;
      });

      return updatedApplications;
    });
  };

  const getApplicationsByStatus = (status: ApplicationStatus): ApplicationRecord[] => {
    return applications.filter(app => app.currentStatus === status);
  };

  const getApplicationsForRole = (role: 'hr' | 'admin') => {
    let pending: ApplicationRecord[] = [];
    
    if (role === 'hr') {
      // HR sees: submitted, under_review, interview_scheduled, interview_completed
      pending = applications.filter(app => 
        ['submitted', 'under_review', 'interview_scheduled', 'interview_completed'].includes(app.currentStatus)
      );
    } else if (role === 'admin') {
      // Admin sees: hr_approved (needs admin decision), and can override hr_rejected
      pending = applications.filter(app => 
        ['hr_approved'].includes(app.currentStatus)
      );
    }

    return {
      pending,
      total: applications
    };
  };

  const createApplication = (applicationData: Partial<ApplicationRecord>): string => {
    const newId = `app-${Date.now()}`;
    const now = new Date().toISOString();
    
    const newApplication: ApplicationRecord = {
      id: newId,
      candidateName: applicationData.candidateName || '',
      email: applicationData.email || '',
      phone: applicationData.phone || '',
      university: applicationData.university || '',
      major: applicationData.major || '',
      graduationDate: applicationData.graduationDate || '',
      skills: applicationData.skills || [],
      position: applicationData.position || 'Intern',
      currentStatus: 'submitted',
      submissionDate: now,
      workflow: [
        {
          status: 'submitted',
          timestamp: now,
          actor: 'System',
          actorRole: 'system',
          notes: 'Application submitted successfully'
        }
      ],
      priority: applicationData.priority || 'normal',
      tags: applicationData.tags || [],
      source: applicationData.source || 'website',
      metadata: applicationData.metadata || {}
    };

    setApplications(prev => [...prev, newApplication]);
    return newId;
  };

  const getApplicationWorkflow = (applicationId: string): ApplicationWorkflowStep[] | null => {
    const application = applications.find(app => app.id === applicationId);
    return application ? application.workflow : null;
  };

  return (
    <ApplicationWorkflowContext.Provider value={{
      applications,
      updateApplicationStatus,
      getApplicationsByStatus,
      getApplicationsForRole,
      createApplication,
      getApplicationWorkflow,
      canTransition
    }}>
      {children}
    </ApplicationWorkflowContext.Provider>
  );
};