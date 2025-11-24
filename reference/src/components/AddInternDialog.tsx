import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus } from 'lucide-react';

interface NewIntern {
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  startDate: string;
  mentor: string;
  location: string;
  university: string;
  status: 'onboarding' | 'active' | 'completed';
}

interface AddInternDialogProps {
  onAddIntern: (intern: NewIntern & { id: number; avatar: string; rating: number | null }) => void;
  trigger?: React.ReactNode;
  currentInternCount: number;
}

export function AddInternDialog({ onAddIntern, trigger, currentInternCount }: AddInternDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newIntern, setNewIntern] = useState<NewIntern>({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    startDate: '',
    mentor: '',
    location: '',
    university: '',
    status: 'onboarding'
  });

  const generateAvatar = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleAddIntern = () => {
    if (!newIntern.name || !newIntern.email || !newIntern.department || !newIntern.position) {
      return; // Basic validation
    }

    const intern = {
      id: currentInternCount + 1,
      ...newIntern,
      avatar: generateAvatar(newIntern.name),
      rating: null
    };

    onAddIntern(intern);
    
    // Reset form
    setNewIntern({
      name: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      startDate: '',
      mentor: '',
      location: '',
      university: '',
      status: 'onboarding'
    });
    setIsOpen(false);
  };

  const handleInputChange = (field: keyof NewIntern, value: string) => {
    setNewIntern(prev => ({ ...prev, [field]: value }));
  };

  const defaultTrigger = (
    <Button>
      <Plus className="w-4 h-4 mr-2" />
      Add Intern
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Intern</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new intern to the system. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newIntern.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={newIntern.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                value={newIntern.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter location"
                value={newIntern.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department *</Label>
              <Select value={newIntern.department} onValueChange={(value) => handleInputChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="HR">Human Resources</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                placeholder="Enter position title"
                value={newIntern.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={newIntern.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="mentor">Assigned Mentor</Label>
              <Select value={newIntern.mentor} onValueChange={(value) => handleInputChange('mentor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mentor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Smith">John Smith</SelectItem>
                  <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                  <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                  <SelectItem value="Lisa Zhang">Lisa Zhang</SelectItem>
                  <SelectItem value="Tom Wilson">Tom Wilson</SelectItem>
                  <SelectItem value="Sarah Lee">Sarah Lee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="university">University/School</Label>
              <Input
                id="university"
                placeholder="Enter university name"
                value={newIntern.university}
                onChange={(e) => handleInputChange('university', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={newIntern.status} onValueChange={(value) => handleInputChange('status', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddIntern}>
              Add Intern
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}