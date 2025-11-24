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
  FileText
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const applications = [
  {
    id: 1,
    name: 'Jessica Martinez',
    email: 'jessica.martinez@university.edu',
    phone: '+1 (555) 111-2222',
    position: 'Frontend Developer Intern',
    department: 'Engineering',
    university: 'MIT',
    gpa: '3.8',
    appliedDate: '2025-02-28',
    status: 'pending',
    resume: 'jessica_martinez_resume.pdf',
    coverLetter: 'jessica_martinez_cover.pdf',
    skills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
    experience: '2 years personal projects',
    avatar: 'JM'
  },
  {
    id: 2,
    name: 'Robert Chen',
    email: 'robert.chen@college.edu',
    phone: '+1 (555) 222-3333',
    position: 'Data Science Intern',
    department: 'Data Science',
    university: 'Carnegie Mellon',
    gpa: '3.9',
    appliedDate: '2025-02-27',
    status: 'interview',
    resume: 'robert_chen_resume.pdf',
    coverLetter: 'robert_chen_cover.pdf',
    skills: ['Python', 'Machine Learning', 'SQL', 'R'],
    experience: '1 year research assistant',
    avatar: 'RC'
  },
  {
    id: 3,
    name: 'Sophia Williams',
    email: 'sophia.williams@uni.edu',
    phone: '+1 (555) 333-4444',
    position: 'UX Design Intern',
    department: 'Design',
    university: 'RISD',
    gpa: '3.7',
    appliedDate: '2025-02-26',
    status: 'approved',
    resume: 'sophia_williams_resume.pdf',
    coverLetter: 'sophia_williams_cover.pdf',
    skills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
    experience: '3 freelance projects',
    avatar: 'SW'
  },
  {
    id: 4,
    name: 'Michael Johnson',
    email: 'michael.johnson@school.edu',
    phone: '+1 (555) 444-5555',
    position: 'Marketing Intern',
    department: 'Marketing',
    university: 'NYU',
    gpa: '3.6',
    appliedDate: '2025-02-25',
    status: 'rejected',
    resume: 'michael_johnson_resume.pdf',
    coverLetter: 'michael_johnson_cover.pdf',
    skills: ['Social Media', 'Content Creation', 'Analytics', 'SEO'],
    experience: '6 months part-time marketing',
    avatar: 'MJ'
  },
  {
    id: 5,
    name: 'Priya Sharma',
    email: 'priya.sharma@tech.edu',
    phone: '+1 (555) 555-6666',
    position: 'Backend Developer Intern',
    department: 'Engineering',
    university: 'UC Berkeley',
    gpa: '3.9',
    appliedDate: '2025-02-24',
    status: 'pending',
    resume: 'priya_sharma_resume.pdf',
    coverLetter: 'priya_sharma_cover.pdf',
    skills: ['Node.js', 'Python', 'Docker', 'AWS'],
    experience: '2 open source contributions',
    avatar: 'PS'
  }
];

export function ApplicationManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'interview': return Calendar;
      case 'approved': return Check;
      case 'rejected': return X;
      default: return Clock;
    }
  };

  const filteredApplications = applications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedApplications = {
    pending: filteredApplications.filter(app => app.status === 'pending'),
    interview: filteredApplications.filter(app => app.status === 'interview'),
    approved: filteredApplications.filter(app => app.status === 'approved'),
    rejected: filteredApplications.filter(app => app.status === 'rejected')
  };

  const ApplicationCard = ({ application }: { application: any }) => {
    const StatusIcon = getStatusIcon(application.status);
    
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" 
            onClick={() => setSelectedApplication(application)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback>{application.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{application.name}</h4>
                <p className="text-sm text-muted-foreground">{application.position}</p>
              </div>
            </div>
            <Badge className={getStatusColor(application.status)}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span className="truncate">{application.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="w-4 h-4" />
              <span>{application.university} - GPA: {application.gpa}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
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
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Application Management</h2>
          <p className="text-muted-foreground">Review and manage intern applications</p>
        </div>
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({filteredApplications.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({groupedApplications.pending.length})</TabsTrigger>
          <TabsTrigger value="interview">Interview ({groupedApplications.interview.length})</TabsTrigger>
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

        <TabsContent value="pending" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedApplications.pending.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="interview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedApplications.interview.map((application) => (
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

      {/* Application Detail Modal would go here */}
      {selectedApplication && (
        <Card className="fixed inset-4 z-50 max-w-4xl mx-auto bg-background border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{selectedApplication.name}</CardTitle>
              <p className="text-muted-foreground">{selectedApplication.position}</p>
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
                    <p className="text-muted-foreground">GPA: {selectedApplication.gpa}</p>
                  </div>
                </div>
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
                  <h4 className="font-semibold mb-2">Experience</h4>
                  <p className="text-sm">{selectedApplication.experience}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-6 border-t">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="destructive">
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button>
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}