import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Check, 
  X, 
  Clock,
  Star,
  Calendar,
  Mail,
  Phone,
  GraduationCap,
  FileText,
  Shield,
  Users
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useApplicationWorkflow } from './ApplicationWorkflow';
import { ApplicationStatusTimeline } from './ApplicationStatusTimeline';
import { AdminApprovalCenter } from './AdminApprovalCenter';
import { useAuth } from './AuthContext';

export function ApplicationManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [activeView, setActiveView] = useState<'applications' | 'approvals'>('applications');
  const { applications } = useApplicationWorkflow();
  const { user } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'interview_scheduled': return 'bg-purple-100 text-purple-800';
      case 'interview_completed': return 'bg-indigo-100 text-indigo-800';
      case 'hr_approved': return 'bg-green-100 text-green-800';
      case 'hr_rejected': return 'bg-red-100 text-red-800';
      case 'admin_approved': return 'bg-emerald-100 text-emerald-800';
      case 'admin_rejected': return 'bg-red-100 text-red-800';
      case 'hired': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return FileText;
      case 'under_review': return Clock;
      case 'interview_scheduled': return Calendar;
      case 'interview_completed': return Check;
      case 'hr_approved': return Check;
      case 'hr_rejected': return X;
      case 'admin_approved': return Shield;
      case 'admin_rejected': return X;
      case 'hired': return Users;
      default: return Clock;
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'submitted': return 'Submitted';
      case 'under_review': return 'Under Review';
      case 'interview_scheduled': return 'Interview Scheduled';
      case 'interview_completed': return 'Interview Completed';
      case 'hr_approved': return 'HR Approved';
      case 'hr_rejected': return 'HR Rejected';
      case 'admin_approved': return 'Admin Approved';
      case 'admin_rejected': return 'Admin Rejected';
      case 'hired': return 'Hired';
      default: return status;
    }
  };

  const filteredApplications = applications.filter(app =>
    app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedApplications = {
    submitted: filteredApplications.filter(app => app.currentStatus === 'submitted'),
    under_review: filteredApplications.filter(app => app.currentStatus === 'under_review'),
    interview_scheduled: filteredApplications.filter(app => app.currentStatus === 'interview_scheduled'),
    interview_completed: filteredApplications.filter(app => app.currentStatus === 'interview_completed'),
    hr_approved: filteredApplications.filter(app => app.currentStatus === 'hr_approved'),
    approved: filteredApplications.filter(app => ['admin_approved', 'hired'].includes(app.currentStatus)),
    rejected: filteredApplications.filter(app => ['hr_rejected', 'admin_rejected'].includes(app.currentStatus))
  };

  const ApplicationCard = ({ application }: { application: any }) => {
    const StatusIcon = getStatusIcon(application.currentStatus);
    
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" 
            onClick={() => setSelectedApplication(application)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback>
                  {application.candidateName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{application.candidateName}</h4>
                <p className="text-sm text-muted-foreground">{application.position}</p>
              </div>
            </div>
            <Badge className={getStatusColor(application.currentStatus)}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {formatStatus(application.currentStatus)}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span className="truncate">{application.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="w-4 h-4" />
              <span>{application.university} - {application.major}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Applied {new Date(application.submissionDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {application.skills.slice(0, 3).map((skill: string) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {application.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{application.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Progress indicators */}
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Steps: {application.workflow.length}</span>
            {application.interviewRating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>{application.interviewRating}/5</span>
              </div>
            )}
            {application.priority === 'high' && (
              <Badge variant="outline" className="text-xs border-red-200 text-red-700">
                High Priority
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Show Admin Approval Center if user is admin and wants to see approvals
  if (activeView === 'approvals' && user?.role === 'admin') {
    return <AdminApprovalCenter />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1>Application Management</h1>
          <p className="text-muted-foreground">Review and manage intern applications</p>
        </div>
        
        {user?.role === 'admin' && (
          <div className="flex gap-2">
            <Button
              variant={activeView === 'applications' ? 'default' : 'outline'}
              onClick={() => setActiveView('applications')}
            >
              <FileText className="w-4 h-4 mr-2" />
              All Applications
            </Button>
            <Button
              variant={activeView === 'approvals' ? 'default' : 'outline'}
              onClick={() => setActiveView('approvals')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Approvals
            </Button>
          </div>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Applications by Status */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({filteredApplications.length})</TabsTrigger>
          <TabsTrigger value="submitted">New ({groupedApplications.submitted.length})</TabsTrigger>
          <TabsTrigger value="under_review">Review ({groupedApplications.under_review.length})</TabsTrigger>
          <TabsTrigger value="interview">Interview ({groupedApplications.interview_scheduled.length + groupedApplications.interview_completed.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({groupedApplications.approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({groupedApplications.rejected.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApplications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedApplications.submitted.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="under_review" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedApplications.under_review.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...groupedApplications.interview_scheduled, ...groupedApplications.interview_completed].map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedApplications.approved.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedApplications.rejected.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-background border shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{selectedApplication.candidateName}</CardTitle>
                <p className="text-muted-foreground">{selectedApplication.position}</p>
                <Badge className={getStatusColor(selectedApplication.currentStatus)} style={{ marginTop: '8px' }}>
                  {formatStatus(selectedApplication.currentStatus)}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Resume
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Cover Letter
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedApplication(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedApplication.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedApplication.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Education</h4>
                    <div className="text-sm">
                      <p>{selectedApplication.university}</p>
                      <p className="text-muted-foreground">Major: {selectedApplication.major}</p>
                      <p className="text-muted-foreground">Graduation: {new Date(selectedApplication.graduationDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {selectedApplication.interviewFeedback && (
                    <div>
                      <h4 className="font-semibold mb-2">Interview Feedback</h4>
                      <div className="text-sm p-3 bg-muted rounded-lg">
                        <p>{selectedApplication.interviewFeedback}</p>
                        {selectedApplication.interviewRating && (
                          <div className="flex items-center gap-1 mt-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>Rating: {selectedApplication.interviewRating}/5</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.skills.map((skill: string) => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Application Details</h4>
                    <div className="text-sm space-y-1">
                      <p>Submitted: {new Date(selectedApplication.submissionDate).toLocaleString()}</p>
                      <p>Priority: {selectedApplication.priority}</p>
                      {selectedApplication.source && <p>Source: {selectedApplication.source}</p>}
                      {selectedApplication.hrReviewer && <p>HR Reviewer: {selectedApplication.hrReviewer}</p>}
                      {selectedApplication.adminReviewer && <p>Admin Reviewer: {selectedApplication.adminReviewer}</p>}
                    </div>
                  </div>

                  {selectedApplication.hrNotes && (
                    <div>
                      <h4 className="font-semibold mb-2">HR Notes</h4>
                      <div className="text-sm p-3 bg-muted rounded-lg">
                        <p>{selectedApplication.hrNotes}</p>
                      </div>
                    </div>
                  )}

                  {selectedApplication.rejectionReason && (
                    <div>
                      <h4 className="font-semibold mb-2">Rejection Reason</h4>
                      <div className="text-sm p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p>{selectedApplication.rejectionReason}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Application Timeline */}
              <ApplicationStatusTimeline
                workflow={selectedApplication.workflow}
                currentStatus={selectedApplication.currentStatus}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}