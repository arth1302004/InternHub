import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Search, 
  Upload, 
  Download, 
  Eye, 
  FileText, 
  Image, 
  File,
  Folder,
  Calendar,
  User,
  MoreVertical,
  Edit,
  Trash,
  Share
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const documents = [
  {
    id: 1,
    name: 'Onboarding_Checklist_2025.pdf',
    type: 'pdf',
    category: 'onboarding',
    size: '245 KB',
    uploadedBy: 'John Smith',
    uploadedByAvatar: 'JS',
    uploadDate: '2025-02-15',
    lastModified: '2025-02-20',
    description: 'Complete onboarding checklist for new interns',
    tags: ['onboarding', 'checklist', 'process'],
    isShared: true
  },
  {
    id: 2,
    name: 'Sarah_Chen_Resume.pdf',
    type: 'pdf',
    category: 'resumes',
    size: '1.2 MB',
    uploadedBy: 'Sarah Chen',
    uploadedByAvatar: 'SC',
    uploadDate: '2025-01-10',
    lastModified: '2025-01-10',
    description: 'Resume for Software Developer Intern position',
    tags: ['resume', 'engineering', 'application'],
    isShared: false
  },
  {
    id: 3,
    name: 'Q1_Performance_Template.docx',
    type: 'doc',
    category: 'templates',
    size: '89 KB',
    uploadedBy: 'Emily Davis',
    uploadedByAvatar: 'ED',
    uploadDate: '2025-02-01',
    lastModified: '2025-02-25',
    description: 'Template for quarterly performance evaluations',
    tags: ['template', 'evaluation', 'performance'],
    isShared: true
  },
  {
    id: 4,
    name: 'Intern_Handbook_2025.pdf',
    type: 'pdf',
    category: 'handbooks',
    size: '3.1 MB',
    uploadedBy: 'Mike Johnson',
    uploadedByAvatar: 'MJ',
    uploadDate: '2025-01-05',
    lastModified: '2025-02-10',
    description: 'Comprehensive handbook for all intern policies and procedures',
    tags: ['handbook', 'policies', 'guidelines'],
    isShared: true
  },
  {
    id: 5,
    name: 'Project_Wireframes.fig',
    type: 'design',
    category: 'designs',
    size: '5.7 MB',
    uploadedBy: 'Emma Wilson',
    uploadedByAvatar: 'EW',
    uploadDate: '2025-02-18',
    lastModified: '2025-02-28',
    description: 'Initial wireframes for the new product feature',
    tags: ['wireframes', 'design', 'ux'],
    isShared: false
  },
  {
    id: 6,
    name: 'Code_Review_Guidelines.md',
    type: 'text',
    category: 'guidelines',
    size: '15 KB',
    uploadedBy: 'Tom Wilson',
    uploadedByAvatar: 'TW',
    uploadDate: '2025-02-22',
    lastModified: '2025-02-26',
    description: 'Best practices and guidelines for code reviews',
    tags: ['guidelines', 'code-review', 'development'],
    isShared: true
  },
  {
    id: 7,
    name: 'Team_Photo_2025.jpg',
    type: 'image',
    category: 'photos',
    size: '2.3 MB',
    uploadedBy: 'Lisa Zhang',
    uploadedByAvatar: 'LZ',
    uploadDate: '2025-02-14',
    lastModified: '2025-02-14',
    description: 'Annual team photo with all interns and mentors',
    tags: ['photo', 'team', 'memories'],
    isShared: true
  },
  {
    id: 8,
    name: 'API_Documentation.xlsx',
    type: 'spreadsheet',
    category: 'documentation',
    size: '456 KB',
    uploadedBy: 'Maya Patel',
    uploadedByAvatar: 'MP',
    uploadDate: '2025-02-20',
    lastModified: '2025-03-01',
    description: 'Detailed API endpoints and usage documentation',
    tags: ['api', 'documentation', 'reference'],
    isShared: false
  }
];

export function DocumentManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const categories = [...new Set(documents.map(doc => doc.category))];
  const types = [...new Set(documents.map(doc => doc.type))];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'doc': return FileText;
      case 'image': return Image;
      case 'design': return Image;
      case 'text': return FileText;
      case 'spreadsheet': return FileText;
      default: return File;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'text-red-600';
      case 'doc': return 'text-blue-600';
      case 'image': return 'text-green-600';
      case 'design': return 'text-purple-600';
      case 'text': return 'text-gray-600';
      case 'spreadsheet': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'onboarding': 'bg-blue-100 text-blue-800',
      'resumes': 'bg-green-100 text-green-800',
      'templates': 'bg-purple-100 text-purple-800',
      'handbooks': 'bg-orange-100 text-orange-800',
      'designs': 'bg-pink-100 text-pink-800',
      'guidelines': 'bg-indigo-100 text-indigo-800',
      'photos': 'bg-yellow-100 text-yellow-800',
      'documentation': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const DocumentCard = ({ document }: { document: any }) => {
    const FileIcon = getFileIcon(document.type);
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <FileIcon className={`w-8 h-8 ${getFileColor(document.type)} flex-shrink-0 mt-1`} />
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold truncate">{document.name}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{document.description}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Badge className={getCategoryColor(document.category)}>
              {document.category.charAt(0).toUpperCase() + document.category.slice(1)}
            </Badge>
            {document.isShared && (
              <Badge variant="outline" className="text-xs">
                Shared
              </Badge>
            )}
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Size</span>
              <span>{document.size}</span>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="w-5 h-5">
                <AvatarFallback className="text-xs">{document.uploadedByAvatar}</AvatarFallback>
              </Avatar>
              <span className="flex-1 truncate">{document.uploadedBy}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Uploaded {new Date(document.uploadDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {document.tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {document.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{document.tags.length - 3} more
              </Badge>
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
          <h2 className="text-2xl font-semibold">Document Management</h2>
          <p className="text-muted-foreground">Organize and share intern-related documents</p>
        </div>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="File Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-blue-600">
                {documents.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Documents</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-green-600">
                {documents.filter(doc => doc.isShared).length}
              </div>
              <div className="text-sm text-muted-foreground">Shared</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-purple-600">
                {categories.length}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-orange-600">
                {documents.filter(doc => {
                  const uploadDate = new Date(doc.uploadDate);
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return uploadDate > oneWeekAgo;
                }).length}
              </div>
              <div className="text-sm text-muted-foreground">Recent</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No documents found matching your criteria.</p>
              <p className="text-sm mt-2">Try adjusting your search or filters.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}