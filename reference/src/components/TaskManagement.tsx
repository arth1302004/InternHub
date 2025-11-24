import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  User,
  Tag,
  MoreVertical,
  Edit,
  Trash,
  Eye,
  FileText,
  Download,
  MessageSquare,
  Paperclip,
  ClipboardList
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const tasks = [
  {
    id: 1,
    title: 'Implement User Authentication',
    description: 'Create login and registration functionality using modern authentication practices',
    assignees: [
      { name: 'Sarah Chen', avatar: 'SC', email: 'sarah.chen@company.com' },
      { name: 'Maya Patel', avatar: 'MP', email: 'maya.patel@company.com' }
    ],
    department: 'Engineering',
    priority: 'high',
    status: 'in-progress',
    dueDate: '2025-03-10',
    createdDate: '2025-02-15',
    createdBy: 'John Smith',
    estimatedHours: 40,
    actualHours: 24,
    tags: ['Frontend', 'Security', 'React'],
    progress: 60,
    comments: [
      { id: 1, author: 'Sarah Chen', message: 'Started working on the login component', date: '2025-02-16', time: '10:30 AM' },
      { id: 2, author: 'Maya Patel', message: 'Added JWT token validation', date: '2025-02-18', time: '2:15 PM' }
    ],
    attachments: [
      { id: 1, name: 'auth_wireframes.pdf', size: '2.1 MB', type: 'pdf' },
      { id: 2, name: 'security_requirements.docx', size: '156 KB', type: 'doc' }
    ]
  },
  {
    id: 2,
    title: 'Design Landing Page Mockups',
    description: 'Create responsive mockups for the new product landing page',
    assignees: [
      { name: 'Emma Wilson', avatar: 'EW', email: 'emma.wilson@company.com' }
    ],
    department: 'Design',
    priority: 'medium',
    status: 'completed',
    dueDate: '2025-03-05',
    createdDate: '2025-02-10',
    createdBy: 'Emily Davis',
    estimatedHours: 24,
    actualHours: 22,
    tags: ['UI/UX', 'Figma', 'Responsive'],
    progress: 100,
    comments: [
      { id: 1, author: 'Emma Wilson', message: 'Completed initial mockups for desktop', date: '2025-02-12', time: '4:20 PM' },
      { id: 2, author: 'Emma Wilson', message: 'Finished responsive versions for mobile and tablet', date: '2025-03-04', time: '11:45 AM' }
    ],
    attachments: [
      { id: 1, name: 'landing_page_mockups.fig', size: '4.7 MB', type: 'design' },
      { id: 2, name: 'responsive_specs.pdf', size: '890 KB', type: 'pdf' }
    ]
  },
  {
    id: 3,
    title: 'Database Schema Design',
    description: 'Design and implement the database schema for the new feature',
    assignees: [
      { name: 'Maya Patel', avatar: 'MP', email: 'maya.patel@company.com' },
      { name: 'David Kim', avatar: 'DK', email: 'david.kim@company.com' }
    ],
    department: 'Engineering',
    priority: 'high',
    status: 'todo',
    dueDate: '2025-03-12',
    createdDate: '2025-02-20',
    createdBy: 'Tom Wilson',
    estimatedHours: 32,
    actualHours: 0,
    tags: ['Backend', 'Database', 'SQL'],
    progress: 0,
    comments: [],
    attachments: [
      { id: 1, name: 'database_requirements.docx', size: '245 KB', type: 'doc' }
    ]
  },
  {
    id: 4,
    title: 'Social Media Campaign Research',
    description: 'Research competitors and best practices for our upcoming social media campaign',
    assignees: [
      { name: 'Alex Rodriguez', avatar: 'AR', email: 'alex.rodriguez@company.com' }
    ],
    department: 'Marketing',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2025-03-08',
    createdDate: '2025-02-18',
    createdBy: 'Lisa Zhang',
    estimatedHours: 16,
    actualHours: 5,
    tags: ['Research', 'Social Media', 'Marketing'],
    progress: 30,
    comments: [
      { id: 1, author: 'Alex Rodriguez', message: 'Started competitor analysis for Instagram and LinkedIn', date: '2025-02-19', time: '9:15 AM' }
    ],
    attachments: [
      { id: 1, name: 'competitor_analysis.xlsx', size: '1.2 MB', type: 'spreadsheet' }
    ]
  },
  {
    id: 5,
    title: 'API Documentation',
    description: 'Write comprehensive documentation for the REST API endpoints',
    assignees: [
      { name: 'David Kim', avatar: 'DK', email: 'david.kim@company.com' },
      { name: 'James Thompson', avatar: 'JT', email: 'james.thompson@company.com' }
    ],
    department: 'Engineering',
    priority: 'low',
    status: 'overdue',
    dueDate: '2025-02-28',
    createdDate: '2025-02-01',
    createdBy: 'Mike Johnson',
    estimatedHours: 20,
    actualHours: 15,
    tags: ['Documentation', 'API', 'Backend'],
    progress: 75,
    comments: [
      { id: 1, author: 'David Kim', message: 'Completed documentation for authentication endpoints', date: '2025-02-15', time: '3:30 PM' },
      { id: 2, author: 'James Thompson', message: 'Working on user management endpoints', date: '2025-02-25', time: '1:20 PM' }
    ],
    attachments: [
      { id: 1, name: 'api_endpoints.md', size: '67 KB', type: 'text' },
      { id: 2, name: 'postman_collection.json', size: '23 KB', type: 'json' }
    ]
  },
  {
    id: 6,
    title: 'User Interview Analysis',
    description: 'Analyze user interview data and create insights report',
    assignees: [
      { name: 'James Thompson', avatar: 'JT', email: 'james.thompson@company.com' },
      { name: 'Emma Wilson', avatar: 'EW', email: 'emma.wilson@company.com' }
    ],
    department: 'Product',
    priority: 'medium',
    status: 'in-progress',
    dueDate: '2025-03-15',
    createdDate: '2025-02-25',
    createdBy: 'Sarah Lee',
    estimatedHours: 28,
    actualHours: 13,
    tags: ['Research', 'UX', 'Analysis'],
    progress: 45,
    comments: [
      { id: 1, author: 'James Thompson', message: 'Completed transcription of 8 interviews', date: '2025-02-27', time: '5:45 PM' },
      { id: 2, author: 'Emma Wilson', message: 'Started thematic analysis of user pain points', date: '2025-03-01', time: '10:00 AM' }
    ],
    attachments: [
      { id: 1, name: 'interview_transcripts.zip', size: '12.3 MB', type: 'archive' },
      { id: 2, name: 'analysis_template.xlsx', size: '234 KB', type: 'spreadsheet' }
    ]
  }
];

export function TaskManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isViewTaskOpen, setIsViewTaskOpen] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return Clock;
      case 'in-progress': return Clock;
      case 'completed': return CheckCircle2;
      case 'overdue': return AlertCircle;
      default: return Clock;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignees.some(assignee => assignee.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleViewTask = (task: any) => {
    setSelectedTask(task);
    setIsViewTaskOpen(true);
  };

  const handleEditTask = (taskId: number) => {
    // TODO: Implement edit task functionality
    console.log('Edit task:', taskId);
  };

  const handleReassignTask = (taskId: number) => {
    // TODO: Implement reassign task functionality
    console.log('Reassign task:', taskId);
  };

  const handleDeleteTask = (taskId: number) => {
    // TODO: Implement delete task functionality
    console.log('Delete task:', taskId);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'doc': return FileText;
      case 'design': return FileText;
      case 'spreadsheet': return FileText;
      case 'text': return FileText;
      case 'json': return FileText;
      case 'archive': return FileText;
      default: return FileText;
    }
  };

  const TaskCard = ({ task }: { task: any }) => {
    const StatusIcon = getStatusIcon(task.status);
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h4 className="font-semibold mb-1">{task.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewTask(task)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditTask(task.id)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReassignTask(task.id)}>
                  <User className="w-4 h-4 mr-2" />
                  Reassign
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTask(task.id)}>
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Badge className={getStatusColor(task.status)}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </Badge>
          </div>

          <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="flex -space-x-1">
                {task.assignees.slice(0, 3).map((assignee: any, index: number) => (
                  <Avatar key={index} className="w-6 h-6 border-2 border-background">
                    <AvatarFallback className="text-xs">{assignee.avatar}</AvatarFallback>
                  </Avatar>
                ))}
                {task.assignees.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                    +{task.assignees.length - 3}
                  </div>
                )}
              </div>
              <span>
                {task.assignees.length === 1 
                  ? task.assignees[0].name 
                  : `${task.assignees[0].name} +${task.assignees.length - 1} other${task.assignees.length > 2 ? 's' : ''}`
                }
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{task.progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {task.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
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
          <h2 className="text-2xl font-semibold">Task Management</h2>
          <p className="text-muted-foreground">Assign and track intern tasks</p>
        </div>
        <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Create a new task and assign it to one or more interns. Set priorities, due dates, and track progress.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input id="title" placeholder="Enter task title..." />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter task description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assignees">Assignees</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interns" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Chen</SelectItem>
                      <SelectItem value="emma">Emma Wilson</SelectItem>
                      <SelectItem value="maya">Maya Patel</SelectItem>
                      <SelectItem value="alex">Alex Rodriguez</SelectItem>
                      <SelectItem value="david">David Kim</SelectItem>
                      <SelectItem value="james">James Thompson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input id="due-date" type="date" />
                </div>
                <div>
                  <Label htmlFor="estimated-hours">Estimated Hours</Label>
                  <Input id="estimated-hours" type="number" placeholder="0" />
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" placeholder="e.g., Frontend, React, API" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewTaskOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewTaskOpen(false)}>
                  Create Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-blue-600">
                {tasks.filter(t => t.status === 'todo').length}
              </div>
              <div className="text-sm text-muted-foreground">To Do</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-yellow-600">
                {tasks.filter(t => t.status === 'in-progress').length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-green-600">
                {tasks.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-red-600">
                {tasks.filter(t => t.status === 'overdue').length}
              </div>
              <div className="text-sm text-muted-foreground">Overdue</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No tasks found matching your criteria.</p>
              <p className="text-sm mt-2">Try adjusting your search or filters.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task View Dialog */}
      {selectedTask && (
        <Dialog open={isViewTaskOpen} onOpenChange={setIsViewTaskOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>{selectedTask.title}</DialogTitle>
              <DialogDescription>
                View complete task details, progress, and team collaboration.
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Task Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-muted-foreground">{selectedTask.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTask.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Status</h4>
                      <Badge className={getStatusColor(selectedTask.status)}>
                        {selectedTask.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Priority</h4>
                      <Badge className={getPriorityColor(selectedTask.priority)}>
                        {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Progress</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{selectedTask.progress}% Complete</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${selectedTask.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Task Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Task Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Created by:</span>
                          <span>{selectedTask.createdBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Department:</span>
                          <span>{selectedTask.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Created:</span>
                          <span>{new Date(selectedTask.createdDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Due Date:</span>
                          <span>{new Date(selectedTask.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Time Tracking</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Estimated:</span>
                          <span>{selectedTask.estimatedHours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Actual:</span>
                          <span>{selectedTask.actualHours}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Remaining:</span>
                          <span>{Math.max(0, selectedTask.estimatedHours - selectedTask.actualHours)}h</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Assignees</h4>
                    <div className="space-y-2">
                      {selectedTask.assignees.map((assignee: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{assignee.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{assignee.name}</p>
                            <p className="text-xs text-muted-foreground">{assignee.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Attachments */}
                {selectedTask.attachments.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Paperclip className="w-4 h-4" />
                      Attachments ({selectedTask.attachments.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedTask.attachments.map((attachment: any) => {
                        const FileIcon = getFileIcon(attachment.type);
                        return (
                          <div key={attachment.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <FileIcon className="w-8 h-8 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{attachment.name}</p>
                              <p className="text-xs text-muted-foreground">{attachment.size}</p>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Comments */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Comments ({selectedTask.comments.length})
                  </h4>
                  {selectedTask.comments.length > 0 ? (
                    <div className="space-y-3">
                      {selectedTask.comments.map((comment: any) => (
                        <div key={comment.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {comment.author.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">
                                {comment.date} at {comment.time}
                              </span>
                            </div>
                            <p className="text-sm">{comment.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No comments yet.</p>
                  )}
                </div>
              </div>
            </ScrollArea>

            <Separator />
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleEditTask(selectedTask.id)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Task
              </Button>
              <Button variant="outline" onClick={() => handleReassignTask(selectedTask.id)}>
                <User className="w-4 h-4 mr-2" />
                Reassign
              </Button>
              <Button onClick={() => setIsViewTaskOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}