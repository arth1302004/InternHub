import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Clock,
  Target,
  Filter,
  Download,
  RefreshCw,
  Eye,
  UserCheck,
  FileText,
  MessageSquare
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

// Mock data for analytics
const applicationTrends = [
  { month: 'Jan', applications: 45, hired: 6, interviews: 28 },
  { month: 'Feb', applications: 52, hired: 8, interviews: 32 },
  { month: 'Mar', applications: 38, hired: 5, interviews: 24 },
  { month: 'Apr', applications: 64, hired: 9, interviews: 35 },
  { month: 'May', applications: 71, hired: 12, interviews: 42 },
  { month: 'Jun', applications: 58, hired: 10, interviews: 38 }
];

const applicationSources = [
  { source: 'University Career Centers', count: 45, percentage: 35 },
  { source: 'LinkedIn', count: 32, percentage: 25 },
  { source: 'Company Website', count: 28, percentage: 22 },
  { source: 'Job Boards', count: 15, percentage: 12 },
  { source: 'Referrals', count: 8, percentage: 6 }
];

const applicationStatus = [
  { status: 'New', count: 12, color: '#3b82f6' },
  { status: 'Under Review', count: 18, color: '#f59e0b' },
  { status: 'Interview Scheduled', count: 8, color: '#8b5cf6' },
  { status: 'Interviewed', count: 15, color: '#06b6d4' },
  { status: 'Offered', count: 6, color: '#10b981' },
  { status: 'Hired', count: 4, color: '#059669' },
  { status: 'Rejected', count: 22, color: '#ef4444' }
];

const positionBreakdown = [
  { position: 'Software Engineering', applications: 45, hired: 8, rate: 18 },
  { position: 'Data Science', applications: 32, hired: 6, rate: 19 },
  { position: 'Product Management', applications: 28, hired: 4, rate: 14 },
  { position: 'Design', applications: 20, hired: 3, rate: 15 },
  { position: 'Marketing', applications: 18, hired: 2, rate: 11 }
];

const timeToHire = [
  { stage: 'Application to Review', days: 3.2 },
  { stage: 'Review to Interview', days: 7.5 },
  { stage: 'Interview to Decision', days: 4.8 },
  { stage: 'Decision to Offer', days: 2.1 },
  { stage: 'Offer to Acceptance', days: 5.3 }
];

const recruitmentFunnel = [
  { stage: 'Applications', count: 245, percentage: 100 },
  { stage: 'Screening', count: 180, percentage: 73 },
  { stage: 'Phone Interview', count: 95, percentage: 39 },
  { stage: 'Technical Interview', count: 65, percentage: 27 },
  { stage: 'Final Interview', count: 42, percentage: 17 },
  { stage: 'Offers', count: 28, percentage: 11 },
  { stage: 'Hires', count: 22, percentage: 9 }
];

const MetricsCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  description?: string;
}> = ({ title, value, change, icon: Icon, description }) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : isNegative ? (
              <TrendingDown className="h-3 w-3 text-red-600" />
            ) : null}
            <span className={isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : ''}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            {description || 'from last month'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const FunnelChart: React.FC<{ data: typeof recruitmentFunnel }> = ({ data }) => {
  return (
    <div className="space-y-3">
      {data.map((stage, index) => (
        <div key={stage.stage} className="relative">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">{stage.stage}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{stage.count}</span>
              <Badge variant="secondary" className="text-xs">
                {stage.percentage}%
              </Badge>
            </div>
          </div>
          <Progress value={stage.percentage} className="h-2" />
          {index < data.length - 1 && (
            <div className="flex justify-center mt-2">
              <div className="w-0.5 h-4 bg-border"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const HRAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedPosition, setSelectedPosition] = useState('all');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>HR Analytics</h1>
          <p className="text-muted-foreground">
            Recruitment metrics and performance insights
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Total Applications"
          value="245"
          change={12}
          icon={FileText}
        />
        <MetricsCard
          title="Active Candidates"
          value="85"
          change={-5}
          icon={Users}
        />
        <MetricsCard
          title="Interviews Scheduled"
          value="32"
          change={8}
          icon={Calendar}
        />
        <MetricsCard
          title="Hires This Month"
          value="12"
          change={15}
          icon={UserCheck}
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Avg. Time to Hire"
          value="23 days"
          change={-8}
          icon={Clock}
          description="vs last period"
        />
        <MetricsCard
          title="Interview-to-Hire Rate"
          value="68%"
          change={5}
          icon={Target}
        />
        <MetricsCard
          title="Messages Sent"
          value="156"
          change={22}
          icon={MessageSquare}
        />
        <MetricsCard
          title="Response Rate"
          value="84%"
          change={3}
          icon={TrendingUp}
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnel">Recruitment Funnel</TabsTrigger>
          <TabsTrigger value="positions">Position Analysis</TabsTrigger>
          <TabsTrigger value="sources">Application Sources</TabsTrigger>
          <TabsTrigger value="timeline">Timeline Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Application Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Application Trends</CardTitle>
                <CardDescription>Applications, interviews, and hires over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={applicationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="applications" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Applications"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="interviews" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      name="Interviews"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="hired" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Hired"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Application Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Current status distribution of all applications</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={applicationStatus}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ status, percentage }) => `${status}: ${percentage}%`}
                    >
                      {applicationStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Time to Hire Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Average Time to Hire Breakdown</CardTitle>
              <CardDescription>Average days spent in each stage of the hiring process</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeToHire} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="days" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recruitment Funnel</CardTitle>
              <CardDescription>Candidate progression through the hiring process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FunnelChart data={recruitmentFunnel} />
                
                <div className="space-y-4">
                  <h4 className="text-lg font-medium">Funnel Insights</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">Conversion Rate</p>
                      <p className="text-2xl font-bold text-blue-900">9%</p>
                      <p className="text-xs text-blue-700">From application to hire</p>
                    </div>
                    
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm font-medium text-orange-900">Biggest Drop-off</p>
                      <p className="text-sm font-bold text-orange-900">Screening to Phone Interview</p>
                      <p className="text-xs text-orange-700">47% of candidates don't proceed</p>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-900">Offer Acceptance Rate</p>
                      <p className="text-2xl font-bold text-green-900">79%</p>
                      <p className="text-xs text-green-700">22 out of 28 offers accepted</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Position Performance</CardTitle>
              <CardDescription>Application and hiring metrics by position</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {positionBreakdown.map((position) => (
                  <div key={position.position} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{position.position}</h4>
                      <p className="text-sm text-muted-foreground">
                        {position.applications} applications • {position.hired} hired
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{position.rate}%</p>
                      <p className="text-xs text-muted-foreground">hire rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applications by Position</CardTitle>
              <CardDescription>Volume of applications received per position</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={positionBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="position" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#3b82f6" name="Applications" />
                  <Bar dataKey="hired" fill="#10b981" name="Hired" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Sources</CardTitle>
                <CardDescription>Where candidates are finding our positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicationSources.map((source, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{source.source}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{source.count}</span>
                          <Badge variant="secondary">{source.percentage}%</Badge>
                        </div>
                      </div>
                      <Progress value={source.percentage} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Performance</CardTitle>
                <CardDescription>Applications received from each source</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={applicationSources}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ source, percentage }) => `${percentage}%`}
                    >
                      {applicationSources.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'][index]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Source Insights</CardTitle>
              <CardDescription>Key findings about application sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Top Performing Source</h4>
                  <p className="text-lg font-bold text-blue-900">University Career Centers</p>
                  <p className="text-sm text-blue-700">35% of all applications</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Fastest Growing</h4>
                  <p className="text-lg font-bold text-green-900">LinkedIn</p>
                  <p className="text-sm text-green-700">+23% vs last quarter</p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900">Highest Quality</h4>
                  <p className="text-lg font-bold text-orange-900">Referrals</p>
                  <p className="text-sm text-orange-700">45% hire rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hiring Timeline Analysis</CardTitle>
              <CardDescription>How quickly we move candidates through the process</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={applicationTrends}>
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
                    fillOpacity={0.3}
                    name="Applications"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="interviews" 
                    stackId="2"
                    stroke="#f59e0b" 
                    fill="#f59e0b"
                    fillOpacity={0.3}
                    name="Interviews"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hired" 
                    stackId="3"
                    stroke="#10b981" 
                    fill="#10b981"
                    fillOpacity={0.3}
                    name="Hired"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Average Days by Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timeToHire.map((stage, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm">{stage.stage}</span>
                      <span className="font-medium">{stage.days} days</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Process Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Time to Hire</span>
                    <span className="font-medium">23 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Target Time</span>
                    <span className="font-medium">21 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Variance</span>
                    <span className="font-medium text-orange-600">+2 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Efficiency</span>
                    <span className="font-medium text-green-600">91%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>• Reduce screening time by 1-2 days</p>
                  <p>• Streamline interview scheduling</p>
                  <p>• Automate initial responses</p>
                  <p>• Set decision deadlines</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};