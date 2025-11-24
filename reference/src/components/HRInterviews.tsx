import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  User,
  Phone,
  Mail,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';

interface Interview {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  position: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'phone' | 'video' | 'in_person';
  location?: string;
  meetingLink?: string;
  interviewer: string;
  interviewerEmail: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  feedback?: string;
  rating?: number;
  nextSteps?: string;
}

const mockInterviews: Interview[] = [
  {
    id: '1',
    candidateName: 'Sarah Johnson',
    candidateEmail: 'sarah.johnson@email.com',
    candidatePhone: '+1 (555) 123-4567',
    position: 'Software Engineering Intern',
    date: '2024-01-20',
    time: '10:00',
    duration: 60,
    type: 'video',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    interviewer: 'John Smith',
    interviewerEmail: 'john.smith@company.com',
    status: 'scheduled',
    notes: 'First round technical interview'
  },
  {
    id: '2',
    candidateName: 'Mike Chen',
    candidateEmail: 'mike.chen@email.com',
    candidatePhone: '+1 (555) 987-6543',
    position: 'Software Engineering Intern',
    date: '2024-01-20',
    time: '14:00',
    duration: 45,
    type: 'phone',
    interviewer: 'Jane Doe',
    interviewerEmail: 'jane.doe@company.com',
    status: 'scheduled',
    notes: 'Initial screening call'
  },
  {
    id: '3',
    candidateName: 'Emily Davis',
    candidateEmail: 'emily.davis@email.com',
    candidatePhone: '+1 (555) 456-7890',
    position: 'Data Science Intern',
    date: '2024-01-19',
    time: '11:00',
    duration: 90,
    type: 'in_person',
    location: 'Office Conference Room A',
    interviewer: 'Bob Wilson',
    interviewerEmail: 'bob.wilson@company.com',
    status: 'completed',
    notes: 'Final round interview',
    feedback: 'Excellent technical skills and great cultural fit. Strong problem-solving abilities.',
    rating: 5,
    nextSteps: 'Proceed with offer'
  },
  {
    id: '4',
    candidateName: 'Alex Rodriguez',
    candidateEmail: 'alex.rodriguez@email.com',
    candidatePhone: '+1 (555) 321-0987',
    position: 'Full Stack Development Intern',
    date: '2024-01-18',
    time: '15:30',
    duration: 60,
    type: 'video',
    meetingLink: 'https://zoom.us/j/123456789',
    interviewer: 'Alice Brown',
    interviewerEmail: 'alice.brown@company.com',
    status: 'completed',
    feedback: 'Strong technical background, good communication skills. Some gaps in system design.',
    rating: 4,
    nextSteps: 'Second round interview scheduled'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'no_show': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'phone': return Phone;
    case 'video': return Video;
    case 'in_person': return MapPin;
    default: return Phone;
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case 'scheduled': return 'Scheduled';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
    case 'no_show': return 'No Show';
    default: return status;
  }
};

const ScheduleInterviewDialog: React.FC<{ onSchedule: (interview: Omit<Interview, 'id'>) => void }> = ({ onSchedule }) => {
  const [formData, setFormData] = useState({
    candidateName: '',
    candidateEmail: '',
    candidatePhone: '',
    position: '',
    date: '',
    time: '',
    duration: 60,
    type: 'video' as 'phone' | 'video' | 'in_person',
    location: '',
    meetingLink: '',
    interviewer: '',
    interviewerEmail: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule({
      ...formData,
      status: 'scheduled'
    });
    // Reset form
    setFormData({
      candidateName: '',
      candidateEmail: '',
      candidatePhone: '',
      position: '',
      date: '',
      time: '',
      duration: 60,
      type: 'video',
      location: '',
      meetingLink: '',
      interviewer: '',
      interviewerEmail: '',
      notes: ''
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule New Interview</DialogTitle>
          <DialogDescription>
            Create a new interview appointment with a candidate
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="candidateName">Candidate Name</Label>
              <Input
                id="candidateName"
                value={formData.candidateName}
                onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="candidateEmail">Candidate Email</Label>
              <Input
                id="candidateEmail"
                type="email"
                value={formData.candidateEmail}
                onChange={(e) => setFormData({ ...formData, candidateEmail: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="candidatePhone">Candidate Phone</Label>
              <Input
                id="candidatePhone"
                value={formData.candidatePhone}
                onChange={(e) => setFormData({ ...formData, candidatePhone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Interview Type</Label>
            <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="video">Video Call</SelectItem>
                <SelectItem value="in_person">In Person</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === 'video' && (
            <div className="space-y-2">
              <Label htmlFor="meetingLink">Meeting Link</Label>
              <Input
                id="meetingLink"
                value={formData.meetingLink}
                onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                placeholder="https://meet.google.com/..."
              />
            </div>
          )}

          {formData.type === 'in_person' && (
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Conference Room A, Building 1"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interviewer">Interviewer</Label>
              <Input
                id="interviewer"
                value={formData.interviewer}
                onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interviewerEmail">Interviewer Email</Label>
              <Input
                id="interviewerEmail"
                type="email"
                value={formData.interviewerEmail}
                onChange={(e) => setFormData({ ...formData, interviewerEmail: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about the interview..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit">Schedule Interview</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const InterviewDetailsDialog: React.FC<{ 
  interview: Interview; 
  onUpdate: (id: string, updates: Partial<Interview>) => void 
}> = ({ interview, onUpdate }) => {
  const [feedback, setFeedback] = useState(interview.feedback || '');
  const [rating, setRating] = useState(interview.rating || 0);
  const [nextSteps, setNextSteps] = useState(interview.nextSteps || '');

  const handleSaveFeedback = () => {
    onUpdate(interview.id, {
      feedback,
      rating,
      nextSteps,
      status: interview.status === 'scheduled' ? 'completed' : interview.status
    });
  };

  const TypeIcon = getTypeIcon(interview.type);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Interview Details</DialogTitle>
          <DialogDescription>
            {interview.candidateName} - {interview.position}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {interview.candidateName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {interview.candidateName}
                </CardTitle>
                <CardDescription>{interview.position}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{interview.candidateEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{interview.candidatePhone}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interview Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{new Date(interview.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{interview.time} ({interview.duration} minutes)</span>
                </div>
                <div className="flex items-center gap-2">
                  <TypeIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="capitalize">{interview.type.replace('_', ' ')}</span>
                </div>
                
                {interview.meetingLink && (
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-muted-foreground" />
                    <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline">
                      Join Meeting
                    </a>
                  </div>
                )}
                
                {interview.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{interview.location}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interviewer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{interview.interviewer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{interview.interviewerEmail}</span>
                </div>
              </CardContent>
            </Card>

            {interview.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{interview.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Interview Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback</Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your feedback about the candidate..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-2xl ${
                          star <= rating ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2">{rating}/5</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextSteps">Next Steps</Label>
                  <Textarea
                    id="nextSteps"
                    value={nextSteps}
                    onChange={(e) => setNextSteps(e.target.value)}
                    placeholder="What are the next steps for this candidate?"
                    rows={3}
                  />
                </div>

                <Button onClick={handleSaveFeedback}>
                  Save Feedback
                </Button>
              </CardContent>
            </Card>

            {interview.feedback && (
              <Card>
                <CardHeader>
                  <CardTitle>Existing Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{interview.feedback}</p>
                  {interview.rating && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>Rating: {interview.rating}/5</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={star <= interview.rating! ? 'text-yellow-500' : 'text-gray-300'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {interview.nextSteps && (
                    <div className="mt-3">
                      <Label>Next Steps:</Label>
                      <p className="text-sm">{interview.nextSteps}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Interview Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <span>Current Status:</span>
                  <Badge className={getStatusColor(interview.status)}>
                    {formatStatus(interview.status)}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => onUpdate(interview.id, { status: 'completed' })}
                    disabled={interview.status === 'completed'}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onUpdate(interview.id, { status: 'cancelled' })}
                    disabled={interview.status === 'cancelled'}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onUpdate(interview.id, { status: 'no_show' })}
                    disabled={interview.status === 'no_show'}
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    No Show
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Reminder Email
                </Button>
                <Button className="w-full" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Reschedule Interview
                </Button>
                <Button className="w-full" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Export Interview Details
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export const HRInterviews: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [activeTab, setActiveTab] = useState('upcoming');

  const handleScheduleInterview = (newInterview: Omit<Interview, 'id'>) => {
    const interview: Interview = {
      ...newInterview,
      id: `interview-${Date.now()}`
    };
    setInterviews(prev => [...prev, interview]);
  };

  const handleUpdateInterview = (id: string, updates: Partial<Interview>) => {
    setInterviews(prev => 
      prev.map(interview => 
        interview.id === id ? { ...interview, ...updates } : interview
      )
    );
  };

  const upcomingInterviews = interviews.filter(i => i.status === 'scheduled');
  const completedInterviews = interviews.filter(i => i.status === 'completed');
  const allInterviews = interviews;

  const renderInterviewList = (interviewList: Interview[]) => (
    <div className="space-y-4">
      {interviewList.map((interview) => {
        const TypeIcon = getTypeIcon(interview.type);
        const today = new Date().toISOString().split('T')[0];
        const isToday = interview.date === today;
        
        return (
          <Card key={interview.id} className={isToday ? 'border-blue-500 bg-blue-50' : ''}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {interview.candidateName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-medium">{interview.candidateName}</h3>
                    <p className="text-sm text-muted-foreground">{interview.position}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(interview.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {interview.time}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <TypeIcon className="w-3 h-3" />
                        {interview.type.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isToday && (
                    <Badge variant="outline" className="border-blue-500 text-blue-700">
                      Today
                    </Badge>
                  )}
                  
                  <Badge className={getStatusColor(interview.status)}>
                    {formatStatus(interview.status)}
                  </Badge>

                  <InterviewDetailsDialog 
                    interview={interview} 
                    onUpdate={handleUpdateInterview}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-3 h-3" />
                  <span>Interviewer: {interview.interviewer}</span>
                </div>
                
                {interview.rating && (
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-sm ${star <= interview.rating! ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground ml-1">{interview.rating}/5</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Interview Management</h1>
          <p className="text-muted-foreground">
            Schedule and manage candidate interviews
          </p>
        </div>
        
        <ScheduleInterviewDialog onSchedule={handleScheduleInterview} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-xl font-bold">{upcomingInterviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-xl font-bold">
                  {interviews.filter(i => i.date === new Date().toISOString().split('T')[0]).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-bold">{completedInterviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{allInterviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interview Lists */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingInterviews.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedInterviews.length})</TabsTrigger>
          <TabsTrigger value="all">All Interviews ({allInterviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingInterviews.length > 0 ? (
            renderInterviewList(upcomingInterviews)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No upcoming interviews</h3>
                <p className="text-muted-foreground mb-4">
                  Schedule your first interview to get started.
                </p>
                <ScheduleInterviewDialog onSchedule={handleScheduleInterview} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedInterviews.length > 0 ? (
            renderInterviewList(completedInterviews)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No completed interviews</h3>
                <p className="text-muted-foreground">
                  Completed interviews will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {renderInterviewList(allInterviews)}
        </TabsContent>
      </Tabs>
    </div>
  );
};