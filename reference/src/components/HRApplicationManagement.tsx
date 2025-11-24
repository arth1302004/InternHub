import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  MapPin,
  Download,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MoreHorizontal
} from 'lucide-react';
import { useApplicationWorkflow, ApplicationRecord, ApplicationStatus } from './ApplicationWorkflow';
import { ApplicationStatusTimeline } from './ApplicationStatusTimeline';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

// Map workflow statuses to HR interface
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

const formatStatus = (status: string) => {
  switch (status) {
    case 'submitted': return 'New Application';
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

// Component for status transitions that respects workflow rules
const StatusTransitionSelect: React.FC<{
  application: ApplicationRecord;
  onStatusChange: (id: string, status: string, notes?: string) => void;
}> = ({ application, onStatusChange }) => {
  const { canTransition } = useApplicationWorkflow();
  
  // Define valid HR transitions for each status
  const getValidTransitions = (currentStatus: ApplicationStatus): { value: ApplicationStatus; label: string }[] => {
    const transitions: { value: ApplicationStatus; label: string }[] = [];
    
    const statusOptions: { value: ApplicationStatus; label: string }[] = [
      { value: 'submitted', label: 'New Application' },
      { value: 'under_review', label: 'Under Review' },
      { value: 'interview_scheduled', label: 'Interview Scheduled' },
      { value: 'interview_completed', label: 'Interview Completed' },
      { value: 'hr_approved', label: 'HR Approved' },
      { value: 'hr_rejected', label: 'HR Rejected' }
    ];

    // Add current status
    const currentOption = statusOptions.find(opt => opt.value === currentStatus);
    if (currentOption) {
      transitions.push(currentOption);
    }

    // Add valid next transitions
    statusOptions.forEach(option => {
      if (option.value !== currentStatus && canTransition(currentStatus, option.value, 'hr')) {
        transitions.push(option);
      }
    });

    return transitions;
  };

  const validTransitions = getValidTransitions(application.currentStatus);

  return (
    <Select 
      value={application.currentStatus} 
      onValueChange={(value) => onStatusChange(application.id, value)}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {validTransitions.map(transition => (
          <SelectItem 
            key={transition.value} 
            value={transition.value}
            disabled={transition.value === application.currentStatus}
          >
            {transition.label}
            {transition.value === application.currentStatus && ' (Current)'}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const ApplicationDetailsDialog: React.FC<{ application: ApplicationRecord; onStatusChange: (id: string, status: string, notes?: string) => void }> = ({ 
  application, 
  onStatusChange 
}) => {
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(application.interviewRating || 0);

  const addNote = () => {
    if (notes.trim()) {
      // In a real app, this would update the application
      console.log('Adding note:', notes);
      setNotes('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View Details
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
            {application.candidateName}
          </DialogTitle>
          <DialogDescription>
            Application for {application.position}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{application.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{application.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Applied: {new Date(application.submissionDate).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Academic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span>{application.university}</span>
                  </div>
                  <div>
                    <strong>Major:</strong> {application.major}
                  </div>

                  <div>
                    <strong>Graduation:</strong> {new Date(application.graduationDate).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills & Qualifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {application.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(application.currentStatus)}>
                    {formatStatus(application.currentStatus)}
                  </Badge>
                  {application.interviewRating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{application.interviewRating}/5</span>
                    </div>
                  )}
                  {application.interviewDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Interview: {new Date(application.interviewDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span>{application.resume || 'No resume uploaded'}</span>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cover Letter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {application.coverLetter || 'No cover letter provided'}
                </p>
              </CardContent>
            </Card>

            {application.portfolio && (
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <a href={application.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {application.portfolio}
                  </a>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <ApplicationStatusTimeline
              workflow={application.workflow}
              currentStatus={application.currentStatus}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 cursor-pointer ${
                        star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                      }`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                  <span className="ml-2">{rating}/5</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Note</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Add your notes about this candidate..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <Button onClick={addNote}>Add Note</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Update Application Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Status transition selector that respects workflow rules */}
                <StatusTransitionSelect
                  application={application}
                  onStatusChange={onStatusChange}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {application.currentStatus === 'submitted' && (
                  <Button 
                    className="w-full" 
                    onClick={() => onStatusChange(application.id, 'under_review', 'Started application review')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Start Review
                  </Button>
                )}
                
                {application.currentStatus === 'under_review' && (
                  <Button 
                    className="w-full" 
                    onClick={() => onStatusChange(application.id, 'interview_scheduled', 'Interview scheduled')}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Interview
                  </Button>
                )}
                
                {application.currentStatus === 'interview_scheduled' && (
                  <Button 
                    className="w-full" 
                    onClick={() => onStatusChange(application.id, 'interview_completed', 'Interview completed')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Interview Complete
                  </Button>
                )}
                
                {application.currentStatus === 'interview_completed' && (
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      onClick={() => onStatusChange(application.id, 'hr_approved', 'Candidate recommended for hiring')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Candidate
                    </Button>
                    <Button 
                      className="w-full" 
                      variant="destructive"
                      onClick={() => onStatusChange(application.id, 'hr_rejected', 'Candidate not suitable')}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Candidate
                    </Button>
                  </div>
                )}
                
                <Button className="w-full" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Application
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export const HRApplicationManagement: React.FC = () => {
  const { applications, getApplicationsForRole, updateApplicationStatus } = useApplicationWorkflow();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.currentStatus === statusFilter;
    const matchesPosition = positionFilter === 'all' || app.position === positionFilter;
    
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const handleStatusChange = (id: string, newStatus: string, notes?: string) => {
    if (!user) return;
    updateApplicationStatus(id, newStatus as any, user.name, 'hr', notes);
  };

  const positions = [...new Set(applications.map(app => app.position))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>Application Management</h1>
        <p className="text-muted-foreground">
          Review and manage intern applications
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="submitted">New Application</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                <SelectItem value="interview_completed">Interview Completed</SelectItem>
                <SelectItem value="hr_approved">HR Approved</SelectItem>
                <SelectItem value="hr_rejected">HR Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {positions.map(position => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <Card key={application.id}>
            <CardContent className="p-6">
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
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-muted-foreground">{application.university}</span>
                      <span className="text-sm text-muted-foreground">
                        Applied: {new Date(application.submissionDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(application.currentStatus)}>
                    {formatStatus(application.currentStatus)}
                  </Badge>
                  
                  {application.interviewRating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">{application.interviewRating}</span>
                    </div>
                  )}

                  <ApplicationDetailsDialog 
                    application={application} 
                    onStatusChange={handleStatusChange}
                  />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Interview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Download Resume
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {application.skills.slice(0, 5).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {application.skills.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{application.skills.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No applications found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};