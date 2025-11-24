import React, { useState } from 'react';
import {
  Send,
  Mail,
  MessageSquare,
  Phone,
  Users,
  Filter,
  Search,
  Calendar,
  Clock,
  FileText,
  Paperclip,
  Star,
  Reply,
  Forward,
  Archive,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface Communication {
  id: string;
  type: 'email' | 'sms' | 'phone' | 'system';
  subject?: string;
  content: string;
  sender: string;
  senderEmail: string;
  recipient: string;
  recipientEmail: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'replied' | 'failed';
  priority: 'low' | 'normal' | 'high';
  tags: string[];
  attachments?: string[];
  relatedTo?: {
    type: 'application' | 'interview' | 'offer';
    id: string;
    title: string;
  };
  threadId?: string;
}

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'application_received' | 'interview_invitation' | 'rejection' | 'offer' | 'follow_up' | 'reminder';
  variables: string[];
}

const mockCommunications: Communication[] = [
  {
    id: '1',
    type: 'email',
    subject: 'Interview Invitation - Software Engineering Intern',
    content: 'Dear Sarah, We would like to invite you for an interview for the Software Engineering Intern position...',
    sender: 'HR Manager',
    senderEmail: 'hr@internhub.com',
    recipient: 'Sarah Johnson',
    recipientEmail: 'sarah.johnson@email.com',
    timestamp: '2024-01-18T10:30:00Z',
    status: 'read',
    priority: 'normal',
    tags: ['interview', 'invitation'],
    relatedTo: {
      type: 'interview',
      id: 'int-001',
      title: 'Software Engineering Intern Interview'
    },
    threadId: 'thread-001'
  },
  {
    id: '2',
    type: 'email',
    subject: 'Application Received - Data Science Intern',
    content: 'Dear Emily, Thank you for your application for the Data Science Intern position...',
    sender: 'HR Manager',
    senderEmail: 'hr@internhub.com',
    recipient: 'Emily Davis',
    recipientEmail: 'emily.davis@email.com',
    timestamp: '2024-01-17T14:15:00Z',
    status: 'delivered',
    priority: 'normal',
    tags: ['application', 'confirmation'],
    relatedTo: {
      type: 'application',
      id: 'app-002',
      title: 'Data Science Intern Application'
    },
    threadId: 'thread-002'
  },
  {
    id: '3',
    type: 'sms',
    content: 'Reminder: Your interview is scheduled for tomorrow at 2:00 PM. Please reply to confirm.',
    sender: 'HR Manager',
    senderEmail: 'hr@internhub.com',
    recipient: 'Mike Chen',
    recipientEmail: 'mike.chen@email.com',
    timestamp: '2024-01-19T16:00:00Z',
    status: 'delivered',
    priority: 'high',
    tags: ['reminder', 'interview'],
    relatedTo: {
      type: 'interview',
      id: 'int-002',
      title: 'Software Engineering Intern Interview'
    }
  },
  {
    id: '4',
    type: 'email',
    subject: 'Congratulations! Job Offer - Full Stack Development Intern',
    content: 'Dear Alex, We are pleased to offer you the Full Stack Development Intern position...',
    sender: 'HR Manager',
    senderEmail: 'hr@internhub.com',
    recipient: 'Alex Rodriguez',
    recipientEmail: 'alex.rodriguez@email.com',
    timestamp: '2024-01-16T11:45:00Z',
    status: 'replied',
    priority: 'high',
    tags: ['offer', 'job'],
    relatedTo: {
      type: 'offer',
      id: 'offer-001',
      title: 'Full Stack Development Intern Offer'
    },
    threadId: 'thread-003'
  }
];

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Application Received',
    subject: 'Application Received - {{position}}',
    content: `Dear {{candidateName}},

Thank you for your application for the {{position}} position at InternHub. We have received your application and our team will review it carefully.

We will contact you within 5-7 business days with an update on your application status.

Best regards,
HR Team`,
    type: 'application_received',
    variables: ['candidateName', 'position']
  },
  {
    id: '2',
    name: 'Interview Invitation',
    subject: 'Interview Invitation - {{position}}',
    content: `Dear {{candidateName}},

We would like to invite you for an interview for the {{position}} position.

Interview Details:
- Date: {{interviewDate}}
- Time: {{interviewTime}}
- Type: {{interviewType}}
- Duration: {{duration}} minutes

Please confirm your availability by replying to this email.

Best regards,
HR Team`,
    type: 'interview_invitation',
    variables: ['candidateName', 'position', 'interviewDate', 'interviewTime', 'interviewType', 'duration']
  },
  {
    id: '3',
    name: 'Interview Reminder',
    subject: 'Interview Reminder - {{position}}',
    content: `Dear {{candidateName}},

This is a friendly reminder about your upcoming interview for the {{position}} position:

- Date: {{interviewDate}}
- Time: {{interviewTime}}
- Type: {{interviewType}}

Please let us know if you need to reschedule.

Best regards,
HR Team`,
    type: 'reminder',
    variables: ['candidateName', 'position', 'interviewDate', 'interviewTime', 'interviewType']
  },
  {
    id: '4',
    name: 'Job Offer',
    subject: 'Congratulations! Job Offer - {{position}}',
    content: `Dear {{candidateName}},

Congratulations! We are pleased to offer you the {{position}} position at InternHub.

Offer Details:
- Start Date: {{startDate}}
- Duration: {{duration}}
- Compensation: {{compensation}}

Please review the attached offer letter and let us know your decision by {{deadline}}.

Best regards,
HR Team`,
    type: 'offer',
    variables: ['candidateName', 'position', 'startDate', 'duration', 'compensation', 'deadline']
  },
  {
    id: '5',
    name: 'Application Rejection',
    subject: 'Update on Your Application - {{position}}',
    content: `Dear {{candidateName}},

Thank you for your interest in the {{position}} position at InternHub.

After careful consideration, we have decided to move forward with other candidates whose experience more closely matches our current needs.

We encourage you to apply for future opportunities that match your qualifications.

Best regards,
HR Team`,
    type: 'rejection',
    variables: ['candidateName', 'position']
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'sent': return 'bg-blue-100 text-blue-800';
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'read': return 'bg-purple-100 text-purple-800';
    case 'replied': return 'bg-indigo-100 text-indigo-800';
    case 'failed': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'normal': return 'bg-blue-100 text-blue-800';
    case 'low': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'email': return Mail;
    case 'sms': return MessageSquare;
    case 'phone': return Phone;
    case 'system': return FileText;
    default: return Mail;
  }
};

const ComposeMessageDialog: React.FC<{ templates: Template[] }> = ({ templates }) => {
  const [messageType, setMessageType] = useState<'email' | 'sms'>('email');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setContent(template.content);
    }
  };

  const handleSend = () => {
    // In a real app, this would send the message
    console.log('Sending message:', { messageType, recipient, subject, content, priority });
    // Reset form
    setRecipient('');
    setSubject('');
    setContent('');
    setSelectedTemplate('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Send className="w-4 h-4 mr-2" />
          Compose Message
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compose New Message</DialogTitle>
          <DialogDescription>
            Send an email or SMS to candidates
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="messageType">Message Type</Label>
              <Select value={messageType} onValueChange={(value: any) => setMessageType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Template (Optional)</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder={messageType === 'email' ? 'candidate@email.com' : '+1 (555) 123-4567'}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          {messageType === 'email' && (
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject..."
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="content">Message</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your message..."
              rows={8}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Save Draft</Button>
            <Button onClick={handleSend}>
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MessageDetailsDialog: React.FC<{ communication: Communication }> = ({ communication }) => {
  const TypeIcon = getTypeIcon(communication.type);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TypeIcon className="w-5 h-5" />
            {communication.subject || 'Message Details'}
          </DialogTitle>
          <DialogDescription>
            {communication.type.toUpperCase()} • {new Date(communication.timestamp).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>From</Label>
              <p className="text-sm">{communication.sender}</p>
              <p className="text-xs text-muted-foreground">{communication.senderEmail}</p>
            </div>
            <div>
              <Label>To</Label>
              <p className="text-sm">{communication.recipient}</p>
              <p className="text-xs text-muted-foreground">{communication.recipientEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(communication.status)}>
              {communication.status}
            </Badge>
            <Badge className={getPriorityColor(communication.priority)}>
              {communication.priority} priority
            </Badge>
          </div>

          {communication.tags.length > 0 && (
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {communication.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {communication.relatedTo && (
            <div>
              <Label>Related To</Label>
              <p className="text-sm">{communication.relatedTo.title}</p>
              <p className="text-xs text-muted-foreground">
                {communication.relatedTo.type} • ID: {communication.relatedTo.id}
              </p>
            </div>
          )}

          <div>
            <Label>Message Content</Label>
            <div className="mt-2 p-3 bg-muted rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{communication.content}</p>
            </div>
          </div>

          {communication.attachments && communication.attachments.length > 0 && (
            <div>
              <Label>Attachments</Label>
              <div className="space-y-2 mt-1">
                {communication.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Paperclip className="w-4 h-4" />
                    <span>{attachment}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Reply className="w-4 h-4 mr-2" />
              Reply
            </Button>
            <Button variant="outline" size="sm">
              <Forward className="w-4 h-4 mr-2" />
              Forward
            </Button>
            <Button variant="outline" size="sm">
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const TemplateManager: React.FC<{ templates: Template[] }> = ({ templates }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Message Templates</h3>
        <Button variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{template.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{template.subject}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {template.content}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{template.type.replace('_', ' ')}</Badge>
                <span className="text-xs text-muted-foreground">
                  Variables: {template.variables.join(', ')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const HRCommunication: React.FC = () => {
  const [communications, setCommunications] = useState<Communication[]>(mockCommunications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = comm.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || comm.status === statusFilter;
    const matchesType = typeFilter === 'all' || comm.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Communication Center</h1>
          <p className="text-muted-foreground">
            Manage all candidate communications
          </p>
        </div>
        
        <ComposeMessageDialog templates={mockTemplates} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-xl font-bold">{communications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Sent Today</p>
                <p className="text-xl font-bold">
                  {communications.filter(c => 
                    new Date(c.timestamp).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Reply className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Awaiting Reply</p>
                <p className="text-xl font-bold">
                  {communications.filter(c => c.status === 'delivered' || c.status === 'read').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-xl font-bold">
                  {communications.filter(c => c.priority === 'high').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Messages List */}
          <div className="space-y-2">
            {filteredCommunications.map((communication) => {
              const TypeIcon = getTypeIcon(communication.type);
              
              return (
                <Card key={communication.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TypeIcon className="w-5 h-5 text-muted-foreground" />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">
                              {communication.subject || `${communication.type.toUpperCase()} Message`}
                            </h3>
                            {communication.priority === 'high' && (
                              <Star className="w-4 h-4 text-orange-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>To: {communication.recipient}</span>
                            <span>{new Date(communication.timestamp).toLocaleString()}</span>
                            {communication.relatedTo && (
                              <span>• {communication.relatedTo.title}</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {communication.content}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(communication.status)}>
                          {communication.status}
                        </Badge>
                        
                        <MessageDetailsDialog communication={communication} />

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Reply className="w-4 h-4 mr-2" />
                              Reply
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Forward className="w-4 h-4 mr-2" />
                              Forward
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="w-4 h-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredCommunications.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No messages found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates">
          <TemplateManager templates={mockTemplates} />
        </TabsContent>
      </Tabs>
    </div>
  );
};