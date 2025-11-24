import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Star,
  Plus,
  MoreVertical,
  ArrowUpDown,
  Users
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useInterns } from './InternContext';
import { AddInternDialog } from './AddInternDialog';
import { InternProfilePreview } from './InternProfilePreview';

export function InternDirectory() {
  const { interns, addIntern } = useInterns();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const departments = [...new Set(interns.map(intern => intern.department))];
  const statuses = [...new Set(interns.map(intern => intern.status))];

  const filteredAndSortedInterns = interns
    .filter(intern => {
      const matchesSearch = intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           intern.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           intern.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = selectedDepartment === 'all' || intern.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || intern.status === selectedStatus;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'startDate':
          aValue = new Date(a.startDate);
          bValue = new Date(b.startDate);
          break;
        case 'department':
          aValue = a.department.toLowerCase();
          bValue = b.department.toLowerCase();
          break;
        case 'status':
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'position':
          aValue = a.position.toLowerCase();
          bValue = b.position.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'onboarding': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Intern Directory</h2>
          <p className="text-muted-foreground">Manage and track all interns</p>
        </div>
        <AddInternDialog 
          onAddIntern={addIntern}
          currentInternCount={interns.length}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search interns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Filter and Sort Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="startDate">Start Date</SelectItem>
                    <SelectItem value="department">Department</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="position">Position</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex-shrink-0"
                  title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
              
              {/* Filter Controls */}
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAndSortedInterns.length} of {interns.length} interns
        </p>
        <div className="text-sm text-muted-foreground">
          Sorted by {sortBy} ({sortOrder === 'asc' ? 'ascending' : 'descending'})
        </div>
      </div>

      {/* Intern Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedInterns.map((intern) => (
          <InternProfilePreview key={intern.id} intern={intern}>
            <div className="hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] group">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 group-hover:ring-2 group-hover:ring-primary/20 transition-all duration-200">
                        <AvatarFallback>{intern.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors duration-200">{intern.name}</h3>
                        <p className="text-sm text-muted-foreground">{intern.position}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem>View Tasks</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(intern.status)}>
                      {intern.status.charAt(0).toUpperCase() + intern.status.slice(1)}
                    </Badge>
                    {intern.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{intern.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{intern.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{intern.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{intern.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Started {new Date(intern.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="text-sm font-medium">{intern.department}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Mentor</p>
                    <p className="text-sm font-medium">{intern.mentor}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </InternProfilePreview>
        ))}
      </div>

      {filteredAndSortedInterns.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No interns found matching your criteria.</p>
              <p className="text-sm mt-2">Try adjusting your search or filters.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}