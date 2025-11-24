import React, { useState } from 'react';
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Star,
  MessageSquare,
  AlertTriangle,
  FileText,
  Users
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { useApplicationWorkflow, ApplicationRecord } from './ApplicationWorkflow';
import { ApplicationStatusTimeline } from './ApplicationStatusTimeline';
import { useAuth } from './AuthContext';

const AdminApprovalDialog: React.FC<{
  application: ApplicationRecord;
  onApprove: (notes: string) => void;
  onReject: (reason: string) => void;
}> = ({ application, onApprove, onReject }) => {
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!decision || !notes.trim()) return;

    setIsSubmitting(true);
    try {
      if (decision === 'approve') {
        onApprove(notes);
      } else {
        onReject(notes);
      }
    } finally {
      setIsSubmitting(false);
      setDecision(null);
      setNotes('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Shield className="w-4 h-4 mr-2" />
          Admin Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {application.candidateName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            Admin Review: {application.candidateName}
          </DialogTitle>
          <DialogDescription>
            Final approval decision for {application.position} position
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* HR Recommendation Summary */}
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>HR Recommendation:</strong> HIRE - This candidate has been approved by the HR team 
              {application.hrReviewer && ` (${application.hrReviewer})`}
              {application.hrNotes && (
                <div className="mt-2 p-2 bg-muted rounded text-sm">
                  <strong>HR Notes:</strong> {application.hrNotes}
                </div>
              )}
            </AlertDescription>
          </Alert>

          {/* Candidate Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Candidate Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{application.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{application.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <span>{application.university} - {application.major}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Graduation: {new Date(application.graduationDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {application.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {application.interviewRating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Interview Rating: {application.interviewRating}/5</span>
                  </div>
                )}
                
                <div>
                  <Label>Priority</Label>
                  <Badge className={
                    application.priority === 'high' ? 'bg-red-100 text-red-800' :
                    application.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {application.priority}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview Feedback */}
          {application.interviewFeedback && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interview Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{application.interviewFeedback}</p>
                {application.interviewDate && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Interview conducted on {new Date(application.interviewDate).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Application Timeline */}
          <ApplicationStatusTimeline
            workflow={application.workflow}
            currentStatus={application.currentStatus}
          />

          {/* Admin Decision */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Admin Decision</CardTitle>
              <CardDescription>
                Make the final hiring decision for this candidate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Button
                  variant={decision === 'approve' ? 'default' : 'outline'}
                  onClick={() => setDecision('approve')}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve & Hire
                </Button>
                <Button
                  variant={decision === 'reject' ? 'destructive' : 'outline'}
                  onClick={() => setDecision('reject')}
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>

              {decision && (
                <div className="space-y-3">
                  <Label>
                    {decision === 'approve' ? 'Approval Notes' : 'Rejection Reason'}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      decision === 'approve'
                        ? 'Enter notes about the approval decision...'
                        : 'Enter the reason for rejection...'
                    }
                    rows={3}
                  />

                  {decision === 'approve' && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Approval will:</strong>
                        <ul className="list-disc list-inside mt-1 text-sm">
                          <li>Automatically create intern account in the system</li>
                          <li>Grant intern access to the platform</li>
                          <li>Send welcome email to the candidate</li>
                          <li>Add to intern directory for task assignment</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {decision === 'reject' && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Rejection will:</strong>
                        <ul className="list-disc list-inside mt-1 text-sm">
                          <li>Mark application as permanently rejected</li>
                          <li>Send rejection email to candidate</li>
                          <li>Remove from pending applications</li>
                          <li>Archive the application record</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !notes.trim()}
                    className="w-full"
                    variant={decision === 'approve' ? 'default' : 'destructive'}
                  >
                    {isSubmitting ? 'Processing...' : 
                     decision === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const AdminApprovalCenter: React.FC = () => {
  const { getApplicationsForRole, updateApplicationStatus } = useApplicationWorkflow();
  const { user } = useAuth();
  const { pending: pendingApplications, total: allApplications } = getApplicationsForRole('admin');

  const handleApprove = (applicationId: string, notes: string) => {
    if (!user) return;
    updateApplicationStatus(
      applicationId,
      'admin_approved',
      user.name,
      'admin',
      notes
    );
  };

  const handleReject = (applicationId: string, reason: string) => {
    if (!user) return;
    updateApplicationStatus(
      applicationId,
      'admin_rejected',
      user.name,
      'admin',
      reason
    );
  };

  const recentDecisions = allApplications
    .filter(app => ['admin_approved', 'admin_rejected', 'hired'].includes(app.currentStatus))
    .sort((a, b) => {
      const aLastStep = a.workflow[a.workflow.length - 1];
      const bLastStep = b.workflow[b.workflow.length - 1];
      return new Date(bLastStep.timestamp).getTime() - new Date(aLastStep.timestamp).getTime();
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Admin Approval Center</h1>
        <p className="text-muted-foreground">
          Final hiring decisions and application approvals
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold">{pendingApplications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Approved Today</p>
                <p className="text-2xl font-bold">
                  {allApplications.filter(app => {
                    const lastStep = app.workflow[app.workflow.length - 1];
                    return lastStep.status === 'admin_approved' &&
                           new Date(lastStep.timestamp).toDateString() === new Date().toDateString();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Hired</p>
                <p className="text-2xl font-bold">
                  {allApplications.filter(app => app.currentStatus === 'hired').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
                <p className="text-2xl font-bold">
                  {allApplications.filter(app => 
                    ['admin_approved', 'hired'].includes(app.currentStatus)
                  ).length > 0 ? 
                    Math.round(
                      (allApplications.filter(app => ['admin_approved', 'hired'].includes(app.currentStatus)).length / 
                       allApplications.filter(app => ['admin_approved', 'admin_rejected', 'hired'].includes(app.currentStatus)).length) * 100
                    ) : 0
                  }%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 w-5" />
            Pending Admin Approvals ({pendingApplications.length})
          </CardTitle>
          <CardDescription>
            Applications approved by HR awaiting final admin decision
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingApplications.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No pending approvals</h3>
              <p className="text-muted-foreground">
                All applications have been processed or are still in HR review.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApplications.map((application) => (
                <Card key={application.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {application.candidateName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h3 className="font-medium">{application.candidateName}</h3>
                          <p className="text-sm text-muted-foreground">{application.position}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>{application.university}</span>
                            <span>•</span>
                            <span>HR: {application.hrReviewer}</span>
                            {application.interviewRating && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-500" />
                                  <span>{application.interviewRating}/5</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className="bg-orange-100 text-orange-800">
                          Awaiting Admin Decision
                        </Badge>
                        
                        <AdminApprovalDialog
                          application={application}
                          onApprove={(notes) => handleApprove(application.id, notes)}
                          onReject={(reason) => handleReject(application.id, reason)}
                        />
                      </div>
                    </div>

                    {application.hrNotes && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                          <strong>HR Recommendation:</strong> {application.hrNotes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Decisions */}
      {recentDecisions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Admin Decisions</CardTitle>
            <CardDescription>
              Latest hiring decisions made by admin team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDecisions.map((application) => {
                const lastStep = application.workflow[application.workflow.length - 1];
                const isApproved = ['admin_approved', 'hired'].includes(application.currentStatus);
                
                return (
                  <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        isApproved ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      
                      <div>
                        <p className="font-medium">{application.candidateName}</p>
                        <p className="text-sm text-muted-foreground">
                          {application.position} • {new Date(lastStep.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <Badge className={
                      isApproved 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }>
                      {isApproved ? 'Approved' : 'Rejected'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};