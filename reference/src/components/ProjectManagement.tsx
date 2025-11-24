import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Calendar,
  Users,
  ClipboardCheck,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  Play,
  Pause,
  Star,
  Target,
  Briefcase,
  FileText,
  Settings,
  Eye,
  Edit,
  Trash2,
  Download,
  Share2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: string;
  endDate: string;
  progress: number;
  budget: number;
  spent: number;
  assignedInterns: string[];
  teamLead: string;
  department: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
  };
}

interface ProjectFormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  budget: string;
  department: string;
  teamLead: string;
  tags: string;
}

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Mobile App',
    description: 'Developing a cross-platform mobile application for online shopping with advanced features.',
    status: 'active',
    priority: 'high',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    progress: 67,
    budget: 150000,
    spent: 98000,
    assignedInterns: ['john-doe', 'jane-smith', 'alex-johnson'],
    teamLead: 'Sarah Wilson',
    department: 'Engineering',
    tags: ['Mobile', 'React Native', 'E-commerce'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-20',
    tasks: { total: 45, completed: 30, inProgress: 8, pending: 7 }
  },
  {
    id: '2',
    title: 'AI Chatbot Integration',
    description: 'Implementing an intelligent chatbot system for customer service automation.',
    status: 'active',
    priority: 'medium',
    startDate: '2024-02-01',
    endDate: '2024-05-15',
    progress: 43,
    budget: 80000,
    spent: 35000,
    assignedInterns: ['mike-brown', 'lisa-davis'],
    teamLead: 'David Chen',
    department: 'AI/ML',
    tags: ['AI', 'NLP', 'Customer Service'],
    createdAt: '2024-01-25',
    updatedAt: '2024-02-05',
    tasks: { total: 32, completed: 14, inProgress: 12, pending: 6 }
  },
  {
    id: '3',
    title: 'Data Analytics Dashboard',
    description: 'Creating a comprehensive analytics dashboard for business intelligence.',
    status: 'planning',
    priority: 'medium',
    startDate: '2024-03-01',
    endDate: '2024-08-30',
    progress: 15,
    budget: 120000,
    spent: 12000,
    assignedInterns: ['emma-wilson'],
    teamLead: 'Rachel Green',
    department: 'Data Science',
    tags: ['Analytics', 'Dashboard', 'BI'],
    createdAt: '2024-02-10',
    updatedAt: '2024-02-15',
    tasks: { total: 28, completed: 4, inProgress: 3, pending: 21 }
  },
  {
    id: '4',
    title: 'Cybersecurity Assessment',
    description: 'Comprehensive security audit and implementation of security measures.',
    status: 'completed',
    priority: 'critical',
    startDate: '2023-11-01',
    endDate: '2024-01-31',
    progress: 100,
    budget: 200000,
    spent: 185000,
    assignedInterns: ['tom-anderson', 'amy-white'],
    teamLead: 'Mark Johnson',
    department: 'Security',
    tags: ['Security', 'Audit', 'Compliance'],
    createdAt: '2023-10-15',
    updatedAt: '2024-01-31',
    tasks: { total: 56, completed: 56, inProgress: 0, pending: 0 }
  },
  {
    id: '5',
    title: 'Cloud Migration',
    description: 'Migrating legacy systems to cloud infrastructure for better scalability.',
    status: 'on-hold',
    priority: 'low',
    startDate: '2024-04-01',
    endDate: '2024-10-30',
    progress: 25,
    budget: 300000,
    spent: 45000,
    assignedInterns: ['chris-martin'],
    teamLead: 'Jennifer Lopez',
    department: 'Infrastructure',
    tags: ['Cloud', 'Migration', 'AWS'],
    createdAt: '2024-03-01',
    updatedAt: '2024-03-15',
    tasks: { total: 67, completed: 17, inProgress: 5, pending: 45 }
  }
];

const statusColors = {
  planning: 'bg-blue-100 text-blue-800 border-blue-200',
  active: 'bg-green-100 text-green-800 border-green-200',
  'on-hold': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200'
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800 border-gray-200',
  medium: 'bg-blue-100 text-blue-800 border-blue-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
};

export const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const [newProject, setNewProject] = useState<ProjectFormData>({
    title: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    startDate: '',
    endDate: '',
    budget: '',
    department: '',
    teamLead: '',
    tags: ''
  });

  // Filter and search logic
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
      const matchesDepartment = departmentFilter === 'all' || project.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
    });
  }, [projects, searchTerm, statusFilter, priorityFilter, departmentFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'active').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const onHold = projects.filter(p => p.status === 'on-hold').length;
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
    
    return { total, active, completed, onHold, totalBudget, totalSpent };
  }, [projects]);

  const departments = [...new Set(projects.map(p => p.department))];

  const handleCreateProject = () => {
    if (!newProject.title.trim()) {
      toast.error('Project title is required');
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title,
      description: newProject.description,
      status: newProject.status as Project['status'],
      priority: newProject.priority as Project['priority'],
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      progress: 0,
      budget: parseFloat(newProject.budget) || 0,
      spent: 0,
      assignedInterns: [],
      teamLead: newProject.teamLead,
      department: newProject.department,
      tags: newProject.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: { total: 0, completed: 0, inProgress: 0, pending: 0 }
    };

    setProjects([...projects, project]);
    setIsCreateDialogOpen(false);
    setNewProject({
      title: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      startDate: '',
      endDate: '',
      budget: '',
      department: '',
      teamLead: '',
      tags: ''
    });
    toast.success('Project created successfully');
  };

  const handleUpdateProjectStatus = (projectId: string, newStatus: Project['status']) => {
    setProjects(projects.map(p => 
      p.id === projectId 
        ? { ...p, status: newStatus, updatedAt: new Date().toISOString() }
        : p
    ));
    toast.success('Project status updated');
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    toast.success('Project deleted successfully');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Project Management</h1>
          <p className="text-muted-foreground">Manage and track all your projects</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input
                  id="title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select value={newProject.status} onValueChange={(value) => setNewProject({...newProject, status: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">Priority</Label>
                  <Select value={newProject.priority} onValueChange={(value) => setNewProject({...newProject, priority: value})}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="budget" className="text-right">Budget</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({...newProject, budget: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">Department</Label>
                  <Input
                    id="department"
                    value={newProject.department}
                    onChange={(e) => setNewProject({...newProject, department: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="teamLead" className="text-right">Team Lead</Label>
                <Input
                  id="teamLead"
                  value={newProject.teamLead}
                  onChange={(e) => setNewProject({...newProject, teamLead: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">Tags</Label>
                <Input
                  id="tags"
                  value={newProject.tags}
                  onChange={(e) => setNewProject({...newProject, tags: e.target.value})}
                  placeholder="Comma separated tags"
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} active projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalBudget)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.totalSpent)} spent
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Hold</CardTitle>
            <Pause className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onHold}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedProject(project);
                        setIsDetailDialogOpen(true);
                      }}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge className={statusColors[project.status]}>
                    {project.status.replace('-', ' ')}
                  </Badge>
                  <Badge className={priorityColors[project.priority]}>
                    {project.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center text-muted-foreground mb-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        Due Date
                      </div>
                      <div className="font-medium">{formatDate(project.endDate)}</div>
                      <div className="text-xs text-muted-foreground">
                        {getDaysRemaining(project.endDate)} days left
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center text-muted-foreground mb-1">
                        <Users className="w-3 h-3 mr-1" />
                        Team
                      </div>
                      <div className="font-medium">{project.assignedInterns.length} interns</div>
                      <div className="text-xs text-muted-foreground">
                        Lead: {project.teamLead}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center text-muted-foreground mb-1">
                        <Target className="w-3 h-3 mr-1" />
                        Budget
                      </div>
                      <div className="font-medium">{formatCurrency(project.budget)}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(project.spent)} spent
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center text-muted-foreground mb-1">
                        <ClipboardCheck className="w-3 h-3 mr-1" />
                        Tasks
                      </div>
                      <div className="font-medium">{project.tasks.completed}/{project.tasks.total}</div>
                      <div className="text-xs text-muted-foreground">
                        {project.tasks.inProgress} in progress
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-sm text-muted-foreground">
                    <th className="text-left p-4 font-medium">Project</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Priority</th>
                    <th className="text-left p-4 font-medium">Progress</th>
                    <th className="text-left p-4 font-medium">Team</th>
                    <th className="text-left p-4 font-medium">Due Date</th>
                    <th className="text-left p-4 font-medium">Budget</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{project.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {project.description}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={statusColors[project.status]}>
                          {project.status.replace('-', ' ')}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={priorityColors[project.priority]}>
                          {project.priority}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress} className="h-2 w-16" />
                          <span className="text-sm">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {project.teamLead.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{project.assignedInterns.length} interns</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div>{formatDate(project.endDate)}</div>
                          <div className="text-muted-foreground">
                            {getDaysRemaining(project.endDate)} days left
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div>{formatCurrency(project.budget)}</div>
                          <div className="text-muted-foreground">
                            {formatCurrency(project.spent)} spent
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedProject(project);
                              setIsDetailDialogOpen(true);
                            }}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Project Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={statusColors[selectedProject.status]}>
                          {selectedProject.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Priority:</span>
                        <Badge className={priorityColors[selectedProject.priority]}>
                          {selectedProject.priority}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Department:</span>
                        <span>{selectedProject.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Team Lead:</span>
                        <span>{selectedProject.teamLead}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date:</span>
                        <span>{formatDate(selectedProject.startDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">End Date:</span>
                        <span>{formatDate(selectedProject.endDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Days Remaining:</span>
                        <span>{getDaysRemaining(selectedProject.endDate)} days</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Budget</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Budget:</span>
                        <span>{formatCurrency(selectedProject.budget)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount Spent:</span>
                        <span>{formatCurrency(selectedProject.spent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Remaining:</span>
                        <span>{formatCurrency(selectedProject.budget - selectedProject.spent)}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Progress 
                        value={(selectedProject.spent / selectedProject.budget) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Task Progress</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Tasks:</span>
                        <span>{selectedProject.tasks.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completed:</span>
                        <span>{selectedProject.tasks.completed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">In Progress:</span>
                        <span>{selectedProject.tasks.inProgress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pending:</span>
                        <span>{selectedProject.tasks.pending}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Progress value={selectedProject.progress} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedProject.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Team Members</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {selectedProject.teamLead.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{selectedProject.teamLead}</span>
                    <Badge variant="outline" className="text-xs">Team Lead</Badge>
                  </div>
                  {selectedProject.assignedInterns.map((intern, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {intern.split('-').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{intern.replace('-', ' ')}</span>
                      <Badge variant="outline" className="text-xs">Intern</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Close
                </Button>
                <Button>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Project
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderKanban className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || departmentFilter !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Get started by creating your first project'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && departmentFilter === 'all' && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};