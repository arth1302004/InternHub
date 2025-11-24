import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Users, 
  FileCheck, 
  Clock, 
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { useInterns } from './InternContext';
import { AddInternDialog } from './AddInternDialog';

const stats = [
  {
    title: 'Active Interns',
    value: '24',
    change: '+3 this month',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    title: 'Pending Applications',
    value: '12',
    change: '+5 new today',
    icon: FileCheck,
    color: 'text-orange-600'
  },
  {
    title: 'Tasks Completed',
    value: '156',
    change: '+23 this week',
    icon: CheckCircle2,
    color: 'text-green-600'
  },
  {
    title: 'Avg Performance',
    value: '4.2/5',
    change: '+0.3 from last month',
    icon: TrendingUp,
    color: 'text-purple-600'
  }
];

const recentActivity = [
  {
    id: 1,
    type: 'application',
    message: 'New application from Sarah Chen',
    time: '2 hours ago',
    status: 'pending'
  },
  {
    id: 2,
    type: 'task',
    message: 'Website redesign task completed by John Doe',
    time: '4 hours ago',
    status: 'completed'
  },
  {
    id: 3,
    type: 'evaluation',
    message: 'Monthly evaluation due for Emma Wilson',
    time: '1 day ago',
    status: 'due'
  },
  {
    id: 4,
    type: 'application',
    message: 'Interview scheduled with Alex Rodriguez',
    time: '2 days ago',
    status: 'scheduled'
  }
];

const upcomingDeadlines = [
  {
    id: 1,
    task: 'Q1 Performance Reviews',
    intern: 'All Active Interns',
    due: 'March 15, 2025',
    priority: 'high'
  },
  {
    id: 2,
    task: 'Project Presentation',
    intern: 'Development Team',
    due: 'March 10, 2025',
    priority: 'medium'
  },
  {
    id: 3,
    task: 'Documentation Update',
    intern: 'Sarah Chen',
    due: 'March 8, 2025',
    priority: 'low'
  }
];

export function Dashboard({ onNavigate }: { onNavigate?: (section: string) => void }) {
  const { interns, addIntern } = useInterns();
  
  const activeInterns = interns.filter(intern => intern.status === 'active').length;
  
  const dynamicStats = [
    {
      title: 'Active Interns',
      value: activeInterns.toString(),
      change: '+3 this month',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Pending Applications',
      value: '12',
      change: '+5 new today',
      icon: FileCheck,
      color: 'text-orange-600'
    },
    {
      title: 'Tasks Completed',
      value: '156',
      change: '+23 this week',
      icon: CheckCircle2,
      color: 'text-green-600'
    },
    {
      title: 'Avg Performance',
      value: '4.2/5',
      change: '+0.3 from last month',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dynamicStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mt-1">
                  {activity.type === 'application' && <FileCheck className="w-4 h-4" />}
                  {activity.type === 'task' && <CheckCircle2 className="w-4 h-4" />}
                  {activity.type === 'evaluation' && <Clock className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge 
                  variant={
                    activity.status === 'completed' ? 'default' :
                    activity.status === 'pending' ? 'secondary' :
                    activity.status === 'due' ? 'destructive' : 'outline'
                  }
                  className="text-xs"
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Deadlines</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    deadline.priority === 'high' ? 'bg-red-500' :
                    deadline.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium">{deadline.task}</p>
                    <p className="text-sm text-muted-foreground">{deadline.intern}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{deadline.due}</p>
                  <Badge 
                    variant={deadline.priority === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {deadline.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AddInternDialog 
              onAddIntern={addIntern}
              currentInternCount={interns.length}
              trigger={
                <Button className="h-auto p-4 flex flex-col items-center gap-2">
                  <Plus className="w-6 h-6" />
                  <span>Add New Intern</span>
                </Button>
              }
            />
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Calendar className="w-6 h-6" />
              <span>Schedule Interview</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <FileCheck className="w-6 h-6" />
              <span>Create Evaluation</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}