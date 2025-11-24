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
import { Slider } from './ui/slider';
import { 
  Plus, 
  Search, 
  Star, 
  Calendar,
  User,
  TrendingUp,
  FileText,
  Edit,
  Eye
} from 'lucide-react';

const evaluations = [
  {
    id: 1,
    internName: 'Sarah Chen',
    internAvatar: 'SC',
    evaluator: 'John Smith',
    period: 'Q1 2025',
    date: '2025-03-01',
    status: 'completed',
    overallRating: 4.5,
    categories: {
      'Technical Skills': 4.5,
      'Communication': 4.0,
      'Problem Solving': 5.0,
      'Teamwork': 4.0,
      'Initiative': 4.5
    },
    comments: 'Sarah has shown excellent technical skills and initiative. She quickly adapted to our tech stack and contributed meaningfully to the project.',
    goals: ['Master React testing patterns', 'Lead a small feature development', 'Improve presentation skills']
  },
  {
    id: 2,
    internName: 'Alex Rodriguez',
    internAvatar: 'AR',
    evaluator: 'Emily Davis',
    period: 'Q1 2025',
    date: '2025-02-28',
    status: 'completed',
    overallRating: 4.2,
    categories: {
      'Technical Skills': 4.0,
      'Communication': 4.5,
      'Problem Solving': 4.0,
      'Teamwork': 4.5,
      'Initiative': 4.0
    },
    comments: 'Alex demonstrates strong communication skills and works well with the team. Marketing campaigns have been well-received.',
    goals: ['Learn advanced analytics tools', 'Lead client presentation', 'Develop content strategy']
  },
  {
    id: 3,
    internName: 'Emma Wilson',
    internAvatar: 'EW',
    evaluator: 'Mike Johnson',
    period: 'Q1 2025',
    date: '2025-03-15',
    status: 'scheduled',
    overallRating: null,
    categories: {},
    comments: '',
    goals: []
  },
  {
    id: 4,
    internName: 'Maya Patel',
    internAvatar: 'MP',
    evaluator: 'Tom Wilson',
    period: 'Q1 2025',
    date: '2025-03-10',
    status: 'in-progress',
    overallRating: null,
    categories: {
      'Technical Skills': 4.8,
      'Communication': 4.0,
      'Problem Solving': 4.5
    },
    comments: 'Maya shows exceptional technical abilities, particularly in backend development...',
    goals: []
  }
];

export function EvaluationSystem() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isNewEvaluationOpen, setIsNewEvaluationOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = evaluation.internName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluation.evaluator.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || evaluation.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const EvaluationCard = ({ evaluation }: { evaluation: any }) => {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedEvaluation(evaluation)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback>{evaluation.internAvatar}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{evaluation.internName}</h4>
                <p className="text-sm text-muted-foreground">{evaluation.period}</p>
              </div>
            </div>
            <Badge className={getStatusColor(evaluation.status)}>
              {evaluation.status.charAt(0).toUpperCase() + evaluation.status.slice(1)}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Evaluator</span>
              <span className="text-sm font-medium">{evaluation.evaluator}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Date</span>
              <span className="text-sm">{new Date(evaluation.date).toLocaleDateString()}</span>
            </div>

            {evaluation.overallRating && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall Rating</span>
                <div className="flex items-center gap-1">
                  {renderStars(evaluation.overallRating)}
                  <span className="text-sm ml-1">{evaluation.overallRating}</span>
                </div>
              </div>
            )}

            {evaluation.status === 'completed' && evaluation.categories && Object.keys(evaluation.categories).length > 0 && (
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground mb-2">Performance Areas</p>
                <div className="space-y-1">
                  {Object.entries(evaluation.categories).slice(0, 3).map(([category, rating]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-xs">{category}</span>
                      <div className="flex items-center gap-1">
                        {renderStars(rating as number)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
          <h2 className="text-2xl font-semibold">Evaluation System</h2>
          <p className="text-muted-foreground">Track intern performance and growth</p>
        </div>
        <Dialog open={isNewEvaluationOpen} onOpenChange={setIsNewEvaluationOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Evaluation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Evaluation</DialogTitle>
              <DialogDescription>
                Create a comprehensive performance evaluation for an intern. Rate their performance across different categories and provide detailed feedback.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="intern">Intern</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select intern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah">Sarah Chen</SelectItem>
                      <SelectItem value="emma">Emma Wilson</SelectItem>
                      <SelectItem value="maya">Maya Patel</SelectItem>
                      <SelectItem value="alex">Alex Rodriguez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="period">Evaluation Period</Label>
                  <Input placeholder="e.g., Q1 2025" />
                </div>
              </div>

              <div>
                <Label>Performance Categories</Label>
                <div className="space-y-4 mt-2">
                  {['Technical Skills', 'Communication', 'Problem Solving', 'Teamwork', 'Initiative'].map(category => (
                    <div key={category}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">{category}</span>
                        <span className="text-sm">4.0</span>
                      </div>
                      <Slider defaultValue={[4]} max={5} step={0.5} className="w-full" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="comments">Comments & Feedback</Label>
                <Textarea id="comments" placeholder="Provide detailed feedback..." className="min-h-24" />
              </div>

              <div>
                <Label htmlFor="goals">Goals for Next Period</Label>
                <Textarea id="goals" placeholder="List goals and objectives..." className="min-h-20" />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewEvaluationOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsNewEvaluationOpen(false)}>
                  Create Evaluation
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
                  placeholder="Search evaluations..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-green-600">
                {evaluations.filter(e => e.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-blue-600">
                {evaluations.filter(e => e.status === 'in-progress').length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-yellow-600">
                {evaluations.filter(e => e.status === 'scheduled').length}
              </div>
              <div className="text-sm text-muted-foreground">Scheduled</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-semibold">
                {(evaluations.filter(e => e.overallRating).reduce((sum, e) => sum + (e.overallRating || 0), 0) / 
                  evaluations.filter(e => e.overallRating).length).toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evaluations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvaluations.map((evaluation) => (
          <EvaluationCard key={evaluation.id} evaluation={evaluation} />
        ))}
      </div>

      {/* Evaluation Detail Modal */}
      {selectedEvaluation && (
        <Dialog open={!!selectedEvaluation} onOpenChange={() => setSelectedEvaluation(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedEvaluation.internName} - {selectedEvaluation.period}
              </DialogTitle>
              <DialogDescription>
                View detailed evaluation results including performance ratings, feedback, and goals for the next evaluation period.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Evaluation Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Evaluator:</span>
                      <span>{selectedEvaluation.evaluator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{new Date(selectedEvaluation.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(selectedEvaluation.status)}>
                        {selectedEvaluation.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {selectedEvaluation.overallRating && (
                  <div>
                    <h4 className="font-semibold mb-2">Overall Rating</h4>
                    <div className="flex items-center gap-2">
                      {renderStars(selectedEvaluation.overallRating)}
                      <span className="text-lg font-semibold">{selectedEvaluation.overallRating}</span>
                    </div>
                  </div>
                )}
              </div>

              {Object.keys(selectedEvaluation.categories).length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Performance Categories</h4>
                  <div className="space-y-3">
                    {Object.entries(selectedEvaluation.categories).map(([category, rating]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span>{category}</span>
                        <div className="flex items-center gap-2">
                          {renderStars(rating as number)}
                          <span className="font-medium">{rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvaluation.comments && (
                <div>
                  <h4 className="font-semibold mb-2">Comments & Feedback</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvaluation.comments}</p>
                </div>
              )}

              {selectedEvaluation.goals.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Goals for Next Period</h4>
                  <ul className="space-y-1">
                    {selectedEvaluation.goals.map((goal: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Evaluation
                </Button>
                <Button>
                  <FileText className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}