import React from 'react';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  User,
  UserCheck,
  Calendar,
  MessageSquare,
  Shield,
  Award
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ApplicationStatus, ApplicationWorkflowStep } from './ApplicationWorkflow';

interface ApplicationStatusTimelineProps {
  workflow: ApplicationWorkflowStep[];
  currentStatus: ApplicationStatus;
  className?: string;
}

const getStatusConfig = (status: ApplicationStatus) => {
  switch (status) {
    case 'submitted':
      return {
        label: 'Application Submitted',
        description: 'Candidate has submitted their application',
        icon: MessageSquare,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        iconColor: 'text-blue-600'
      };
    case 'under_review':
      return {
        label: 'Under Review',
        description: 'HR team is reviewing the application',
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        iconColor: 'text-yellow-600'
      };
    case 'interview_scheduled':
      return {
        label: 'Interview Scheduled',
        description: 'Interview has been scheduled with candidate',
        icon: Calendar,
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        iconColor: 'text-purple-600'
      };
    case 'interview_completed':
      return {
        label: 'Interview Completed',
        description: 'Interview has been completed, awaiting HR decision',
        icon: User,
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        iconColor: 'text-indigo-600'
      };
    case 'hr_approved':
      return {
        label: 'HR Approved',
        description: 'HR has approved, pending final admin approval',
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800 border-green-200',
        iconColor: 'text-green-600'
      };
    case 'hr_rejected':
      return {
        label: 'HR Rejected',
        description: 'Application rejected by HR team',
        icon: XCircle,
        color: 'bg-red-100 text-red-800 border-red-200',
        iconColor: 'text-red-600'
      };
    case 'admin_approved':
      return {
        label: 'Admin Approved',
        description: 'Final approval by admin, candidate will be hired',
        icon: Shield,
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        iconColor: 'text-emerald-600'
      };
    case 'admin_rejected':
      return {
        label: 'Admin Rejected',
        description: 'Application rejected by admin',
        icon: XCircle,
        color: 'bg-red-100 text-red-800 border-red-200',
        iconColor: 'text-red-600'
      };
    case 'hired':
      return {
        label: 'Hired',
        description: 'Candidate successfully hired and onboarded',
        icon: Award,
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        iconColor: 'text-emerald-600'
      };
    default:
      return {
        label: status,
        description: '',
        icon: AlertCircle,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        iconColor: 'text-gray-600'
      };
  }
};

const getRoleColor = (role: 'system' | 'hr' | 'admin') => {
  switch (role) {
    case 'system': return 'bg-gray-50 text-gray-700';
    case 'hr': return 'bg-blue-50 text-blue-700';
    case 'admin': return 'bg-purple-50 text-purple-700';
    default: return 'bg-gray-50 text-gray-700';
  }
};

export const ApplicationStatusTimeline: React.FC<ApplicationStatusTimelineProps> = ({
  workflow,
  currentStatus,
  className = ''
}) => {
  const sortedWorkflow = [...workflow].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Application Timeline
        </CardTitle>
        <CardDescription>
          Track the progress of this application through the hiring process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedWorkflow.map((step, index) => {
            const config = getStatusConfig(step.status);
            const Icon = config.icon;
            const isLast = index === sortedWorkflow.length - 1;
            const isCurrent = step.status === currentStatus;

            return (
              <div key={`${step.status}-${step.timestamp}`} className="relative">
                <div className="flex items-start gap-4">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 rounded-full border-2 flex items-center justify-center
                      ${isCurrent ? config.color : 'bg-gray-100 text-gray-400 border-gray-200'}
                      ${isCurrent ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                    `}>
                      <Icon className={`w-5 h-5 ${isCurrent ? config.iconColor : 'text-gray-400'}`} />
                    </div>
                    
                    {!isLast && (
                      <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {config.label}
                      </h4>
                      {isCurrent && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {config.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{new Date(step.timestamp).toLocaleString()}</span>
                      
                      <div className="flex items-center gap-1">
                        <span>By:</span>
                        <Badge variant="outline" className={`text-xs ${getRoleColor(step.actorRole)}`}>
                          {step.actor}
                        </Badge>
                      </div>
                    </div>

                    {step.notes && (
                      <div className="mt-2 p-2 bg-muted rounded-lg">
                        <p className="text-sm">{step.notes}</p>
                      </div>
                    )}

                    {step.metadata && (
                      <div className="mt-2">
                        {step.metadata.interviewType && (
                          <Badge variant="outline" className="text-xs mr-2">
                            {step.metadata.interviewType}
                          </Badge>
                        )}
                        {step.metadata.rating && (
                          <Badge variant="outline" className="text-xs">
                            Rating: {step.metadata.rating}/5
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Summary */}
        <Separator className="my-4" />
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Status</p>
            <div className="flex items-center gap-2 mt-1">
              {(() => {
                const config = getStatusConfig(currentStatus);
                const Icon = config.icon;
                return (
                  <>
                    <Icon className={`w-4 h-4 ${config.iconColor}`} />
                    <span className="font-medium">{config.label}</span>
                  </>
                );
              })()}
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Timeline Duration</p>
            <p className="font-medium">
              {workflow.length > 1 && (
                <>
                  {Math.ceil(
                    (new Date(workflow[workflow.length - 1].timestamp).getTime() - 
                     new Date(workflow[0].timestamp).getTime()) / (1000 * 60 * 60 * 24)
                  )} days
                </>
              )}
            </p>
          </div>
        </div>

        {/* Next Steps */}
        {!['hired', 'hr_rejected', 'admin_rejected'].includes(currentStatus) && (
          <>
            <Separator className="my-4" />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Next Steps</p>
              <div className="text-sm">
                {currentStatus === 'submitted' && (
                  <p>• HR team will review the application within 2-3 business days</p>
                )}
                {currentStatus === 'under_review' && (
                  <p>• HR team is reviewing qualifications and may schedule an interview</p>
                )}
                {currentStatus === 'interview_scheduled' && (
                  <p>• Candidate will attend the scheduled interview</p>
                )}
                {currentStatus === 'interview_completed' && (
                  <p>• HR team will make a hiring recommendation</p>
                )}
                {currentStatus === 'hr_approved' && (
                  <p>• Admin will review HR recommendation and make final decision</p>
                )}
                {currentStatus === 'admin_approved' && (
                  <p>• Candidate will be automatically onboarded into the system</p>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};