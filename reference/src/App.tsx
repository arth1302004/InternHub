import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  BarChart3, 
  ClipboardList, 
  Star, 
  FolderKanban,
  Home,
  Settings,
  Bell,
  LogOut
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Avatar, AvatarFallback } from './components/ui/avatar';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { Dashboard } from './components/Dashboard';
import { InternDirectory } from './components/InternDirectory';
import { ApplicationManagement } from './components/ApplicationManagement';
import { TaskManagement } from './components/TaskManagement';
import { EvaluationSystem } from './components/EvaluationSystem';
import { ProjectManagement } from './components/ProjectManagement';
import { Analytics } from './components/Analytics';
import { InternProvider } from './components/InternContext';
import { AuthProvider, useAuth } from './components/AuthContext';
import { ApplicationWorkflowProvider } from './components/ApplicationWorkflow';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { InternDashboard } from './components/InternDashboard';
import { HRDashboard } from './components/HRDashboard';

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'interns', name: 'Intern Directory', icon: Users },
  { id: 'applications', name: 'Applications', icon: FileText, badge: 5 },
  { id: 'tasks', name: 'Task Management', icon: ClipboardList },
  { id: 'evaluations', name: 'Evaluations', icon: Star },
  { id: 'projects', name: 'Projects', icon: FolderKanban },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
];

// Auth Wrapper Component
const AuthWrapper: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-4 h-4 text-primary-foreground animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' ? (
      <Login onSwitchToSignup={() => setAuthMode('signup')} />
    ) : (
      <Signup onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  // Route based on user role
  if (user.role === 'admin') {
    return <AdminDashboard />;
  } else if (user.role === 'hr') {
    return <HRDashboard />;
  } else {
    return <InternDashboard />;
  }
};

// Admin Dashboard Component (existing functionality)
const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user, logout } = useAuth();

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveSection} />;
      case 'interns':
        return <InternDirectory />;
      case 'applications':
        return <ApplicationManagement />;
      case 'tasks':
        return <TaskManagement />;
      case 'evaluations':
        return <EvaluationSystem />;
      case 'projects':
        return <ProjectManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <ApplicationWorkflowProvider>
      <InternProvider>
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
                  <p className="text-sm text-muted-foreground">Admin Panel</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarMenu className="p-2">
                {navigation.map((item) => (
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
                    {navigation.find(item => item.id === activeSection)?.name || 'Dashboard'}
                  </h1>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Bell className="w-4 h-4" />
                  </Button>
                  <Avatar>
                    <AvatarFallback>
                      {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AD'}
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
      </InternProvider>
    </ApplicationWorkflowProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ApplicationWorkflowProvider>
        <AuthWrapper />
      </ApplicationWorkflowProvider>
    </AuthProvider>
  );
}