import React, { useState } from 'react';
import { 
  User, 
  FileText, 
  ClipboardList, 
  Star, 
  FolderOpen,
  Home,
  Settings,
  Bell,
  LogOut,
  Calendar,
  Award,
  BookOpen
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { useAuth } from './AuthContext';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';

const internNavigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'profile', name: 'My Profile', icon: User },
  { id: 'applications', name: 'My Applications', icon: FileText, badge: 2 },
  { id: 'tasks', name: 'My Tasks', icon: ClipboardList, badge: 3 },
  { id: 'evaluations', name: 'Evaluations', icon: Star },
  { id: 'documents', name: 'Documents', icon: FolderOpen },
  { id: 'learning', name: 'Learning', icon: BookOpen },
];

const InternDashboardContent: React.FC = () => {
  const { user } = useAuth();

  const mockTasks = [
    { id: 1, title: 'Complete onboarding documentation', status: 'pending', priority: 'high', dueDate: '2025-01-10' },
    { id: 2, title: 'Review project requirements', status: 'in-progress', priority: 'medium', dueDate: '2025-01-12' },
    { id: 3, title: 'Submit weekly report', status: 'completed', priority: 'low', dueDate: '2025-01-08' }
  ];

  const mockApplications = [
    { id: 1, position: 'Software Engineering Intern', company: 'TechCorp', status: 'under-review', appliedDate: '2025-01-05' },
    { id: 2, position: 'Marketing Intern', company: 'StartupXYZ', status: 'interview-scheduled', appliedDate: '2025-01-03' }
  ];

  const completedTasks = mockTasks.filter(task => task.status === 'completed').length;
  const progressPercentage = (completedTasks / mockTasks.length) * 100;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Here's your internship overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{user?.major}</Badge>
          <Badge variant="outline">{user?.university}</Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTasks.filter(t => t.status !== 'completed').length}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              1 interview scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
            <Progress value={progressPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluation</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-xs text-muted-foreground">
              Average rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Your latest assignments and their status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant={task.status === 'completed' ? 'default' : task.status === 'in-progress' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {task.status.replace('-', ' ')}
                    </Badge>
                    <Badge 
                      variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Application Status */}
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>Track your internship applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{app.position}</p>
                  <p className="text-sm text-muted-foreground">{app.company}</p>
                  <Badge 
                    variant={app.status === 'interview-scheduled' ? 'default' : 'secondary'}
                    className="text-xs mt-1"
                  >
                    {app.status.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Applied: {new Date(app.appliedDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Events
          </CardTitle>
          <CardDescription>Your schedule for the next few days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-sm">Team Meeting</p>
                <p className="text-xs text-muted-foreground">Project kickoff and role assignments</p>
              </div>
              <div className="text-xs text-muted-foreground">Tomorrow, 2:00 PM</div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-sm">Interview - StartupXYZ</p>
                <p className="text-xs text-muted-foreground">Marketing Intern position</p>
              </div>
              <div className="text-xs text-muted-foreground">Jan 12, 10:00 AM</div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-sm">Evaluation Meeting</p>
                <p className="text-xs text-muted-foreground">Monthly performance review</p>
              </div>
              <div className="text-xs text-muted-foreground">Jan 15, 3:00 PM</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InternProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Your personal and academic information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-lg">
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{user?.name}</h3>
              <p className="text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-1">{user?.role}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Contact Information</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Phone</label>
                  <p>{user?.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Academic Information</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-muted-foreground">University</label>
                  <p>{user?.university || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Major</label>
                  <p>{user?.major || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Expected Graduation</label>
                  <p>{user?.graduationDate ? new Date(user.graduationDate + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {user?.skills && user.skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Skills & Interests</h4>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export const InternDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user, logout } = useAuth();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <InternDashboardContent />;
      case 'profile':
        return <InternProfile />;
      case 'applications':
        return <div className="text-center py-12 text-muted-foreground">Applications section coming soon...</div>;
      case 'tasks':
        return <div className="text-center py-12 text-muted-foreground">Tasks section coming soon...</div>;
      case 'evaluations':
        return <div className="text-center py-12 text-muted-foreground">Evaluations section coming soon...</div>;
      case 'documents':
        return <div className="text-center py-12 text-muted-foreground">Documents section coming soon...</div>;
      case 'learning':
        return <div className="text-center py-12 text-muted-foreground">Learning section coming soon...</div>;
      default:
        return <InternDashboardContent />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold">InternHub</h2>
                <p className="text-sm text-muted-foreground">Intern Portal</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu className="p-2">
              {internNavigation.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="w-full justify-start"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

            <div className="mt-auto p-4 border-t border-sidebar-border">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={logout}>
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="border-b border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <h1 className="capitalize">
                  {internNavigation.find(item => item.id === activeSection)?.name || 'Dashboard'}
                </h1>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Bell className="w-4 h-4" />
                </Button>
                <Avatar>
                  <AvatarFallback>
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 bg-background">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};