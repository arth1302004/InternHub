import React, { useState } from 'react';
import { 
  FileText, 
  BarChart3, 
  Users, 
  Calendar,
  MessageSquare,
  Home,
  Settings,
  Bell,
  LogOut,
  TrendingUp,
  UserCheck,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { useAuth } from './AuthContext';
import { HRApplicationManagement } from './HRApplicationManagement';
import { HRAnalytics } from './HRAnalytics';
import { HRInterviews } from './HRInterviews';
import { HRCommunication } from './HRCommunication';

const hrNavigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'applications', name: 'Applications', icon: FileText, badge: 12 },
  { id: 'interviews', name: 'Interviews', icon: Calendar, badge: 3 },
  { id: 'communication', name: 'Communication', icon: MessageSquare },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
];

const HRDashboardContent: React.FC<{ onNavigate: (section: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1>HR Dashboard</h1>
        <p className="text-muted-foreground">
          Manage intern applications and recruitment process
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Awaiting initial review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              This week: 3 upcoming
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hired This Month</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from target
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('applications')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Review Applications
            </CardTitle>
            <CardDescription>
              12 applications pending review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Go to Applications
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('interviews')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Interviews
            </CardTitle>
            <CardDescription>
              3 interviews scheduled for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Manage Interviews
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('analytics')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              View Analytics
            </CardTitle>
            <CardDescription>
              Recruitment metrics and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates on applications and interviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">New application from <strong>Sarah Johnson</strong></p>
                <p className="text-xs text-muted-foreground">Computer Science, Stanford University</p>
              </div>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">Interview completed with <strong>Mike Chen</strong></p>
                <p className="text-xs text-muted-foreground">Software Engineering position</p>
              </div>
              <span className="text-xs text-muted-foreground">4 hours ago</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">Application status updated for <strong>Emily Davis</strong></p>
                <p className="text-xs text-muted-foreground">Moved to second round</p>
              </div>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">Offer sent to <strong>Alex Rodriguez</strong></p>
                <p className="text-xs text-muted-foreground">Data Science internship</p>
              </div>
              <span className="text-xs text-muted-foreground">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Urgent Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Urgent Items
          </CardTitle>
          <CardDescription>Items requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <div>
                <p className="text-sm font-medium">3 interviews scheduled for today</p>
                <p className="text-xs text-muted-foreground">Starting at 10:00 AM</p>
              </div>
              <Button size="sm" onClick={() => onNavigate('interviews')}>
                View Schedule
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
              <div>
                <p className="text-sm font-medium">5 applications overdue for review</p>
                <p className="text-xs text-muted-foreground">Submitted more than 7 days ago</p>
              </div>
              <Button size="sm" onClick={() => onNavigate('applications')}>
                Review Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const HRDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user, logout } = useAuth();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <HRDashboardContent onNavigate={setActiveSection} />;
      case 'applications':
        return <HRApplicationManagement />;
      case 'interviews':
        return <HRInterviews />;
      case 'communication':
        return <HRCommunication />;
      case 'analytics':
        return <HRAnalytics />;
      default:
        return <HRDashboardContent onNavigate={setActiveSection} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold">InternHub</h2>
                <p className="text-sm text-muted-foreground">HR Portal</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu className="p-2">
              {hrNavigation.map((item) => (
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
                  {hrNavigation.find(item => item.id === activeSection)?.name || 'Dashboard'}
                </h1>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Bell className="w-4 h-4" />
                </Button>
                <Avatar>
                  <AvatarFallback>
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'HR'}
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