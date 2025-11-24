import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CheckCircle2, 
  Clock,
  Star,
  FileText,
  Calendar,
  Download
} from 'lucide-react';

const performanceData = [
  { month: 'Jan', rating: 4.1, tasks: 45, applications: 23 },
  { month: 'Feb', rating: 4.3, tasks: 52, applications: 31 },
  { month: 'Mar', rating: 4.5, tasks: 48, applications: 28 },
  { month: 'Apr', rating: 4.2, tasks: 55, applications: 35 },
  { month: 'May', rating: 4.6, tasks: 61, applications: 42 },
  { month: 'Jun', rating: 4.4, tasks: 58, applications: 38 }
];

const departmentData = [
  { name: 'Engineering', value: 40, color: '#3b82f6' },
  { name: 'Design', value: 25, color: '#10b981' },
  { name: 'Marketing', value: 20, color: '#f59e0b' },
  { name: 'Product', value: 10, color: '#8b5cf6' },
  { name: 'Data Science', value: 5, color: '#ef4444' }
];

const taskCompletionData = [
  { week: 'Week 1', completed: 12, total: 15 },
  { week: 'Week 2', completed: 18, total: 20 },
  { week: 'Week 3', completed: 14, total: 18 },
  { week: 'Week 4', completed: 22, total: 25 },
  { week: 'Week 5', completed: 16, total: 19 },
  { week: 'Week 6', completed: 25, total: 28 }
];

const applicationTrendData = [
  { month: 'Jan', applications: 23, accepted: 8, rejected: 10, pending: 5 },
  { month: 'Feb', applications: 31, accepted: 12, rejected: 14, pending: 5 },
  { month: 'Mar', applications: 28, accepted: 10, rejected: 13, pending: 5 },
  { month: 'Apr', applications: 35, accepted: 15, rejected: 15, pending: 5 },
  { month: 'May', applications: 42, accepted: 18, rejected: 19, pending: 5 },
  { month: 'Jun', applications: 38, accepted: 16, rejected: 17, pending: 5 }
];

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track performance and trends across your intern program</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Interns</p>
                <p className="text-2xl font-semibold">24</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12% from last month</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Performance</p>
                <p className="text-2xl font-semibold">4.4/5</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+0.3 from last month</span>
                </div>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Task Completion</p>
                <p className="text-2xl font-semibold">89%</p>
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <TrendingDown className="w-4 h-4" />
                  <span>-2% from last month</span>
                </div>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-semibold">38</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+15% from last month</span>
                </div>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[3.5, 5]} />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'rating' ? 'Average Rating' : name]}
                />
                <Line 
                  type="monotone" 
                  dataKey="rating" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Interns by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {departmentData.map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: dept.color }}
                      />
                      <span className="text-sm">{dept.name}</span>
                    </div>
                    <span className="text-sm font-medium">{dept.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Completion Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="total" fill="#e5e7eb" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Application Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Application Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={applicationTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="applications" 
                  stackId="1" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                  name="Total Applications"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Metric</th>
                  <th className="text-left p-2">Current Month</th>
                  <th className="text-left p-2">Previous Month</th>
                  <th className="text-left p-2">Change</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-medium">Active Interns</td>
                  <td className="p-2">24</td>
                  <td className="p-2">21</td>
                  <td className="p-2 text-green-600">+3 (+14.3%)</td>
                  <td className="p-2">
                    <Badge className="bg-green-100 text-green-800">Good</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Average Rating</td>
                  <td className="p-2">4.4</td>
                  <td className="p-2">4.1</td>
                  <td className="p-2 text-green-600">+0.3 (+7.3%)</td>
                  <td className="p-2">
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Task Completion</td>
                  <td className="p-2">89%</td>
                  <td className="p-2">91%</td>
                  <td className="p-2 text-red-600">-2% (-2.2%)</td>
                  <td className="p-2">
                    <Badge className="bg-yellow-100 text-yellow-800">Needs Attention</Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Applications</td>
                  <td className="p-2">38</td>
                  <td className="p-2">33</td>
                  <td className="p-2 text-green-600">+5 (+15.2%)</td>
                  <td className="p-2">
                    <Badge className="bg-green-100 text-green-800">Strong</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Retention Rate</td>
                  <td className="p-2">96%</td>
                  <td className="p-2">94%</td>
                  <td className="p-2 text-green-600">+2% (+2.1%)</td>
                  <td className="p-2">
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}