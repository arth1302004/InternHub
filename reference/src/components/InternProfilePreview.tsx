import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  GraduationCap,
  User,
  Star,
  Building2,
  Clock,
  BookOpen
} from 'lucide-react';
import { Intern } from './InternContext';

interface InternProfilePreviewProps {
  intern: Intern;
  children: React.ReactNode;
}

export function InternProfilePreview({ intern, children }: InternProfilePreviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'onboarding': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateDuration = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} ${years === 1 ? 'year' : 'years'}${remainingMonths > 0 ? ` ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}` : ''}`;
    }
  };

  const formatStartDate = (startDate: string) => {
    return new Date(startDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogTitle className="sr-only">
          {intern.name} - Profile Preview
        </DialogTitle>
        <DialogDescription className="sr-only">
          Detailed profile information for {intern.name}, including contact details, academic information, and work details.
        </DialogDescription>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative"
          >
            {/* Header with gradient background */}
            <motion.div 
              className="relative h-24 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute inset-0 bg-grid-small opacity-5" />
            </motion.div>

            {/* Profile Content */}
            <div className="relative -mt-12 px-6 pb-6">
              {/* Avatar and Basic Info */}
              <motion.div 
                className="flex flex-col items-center text-center mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Avatar className="w-24 h-24 border-4 border-background shadow-lg mb-4">
                  <AvatarFallback className="text-lg font-medium">{intern.avatar}</AvatarFallback>
                </Avatar>
                
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-1">{intern.name}</h2>
                  <p className="text-muted-foreground mb-3">{intern.position}</p>
                  
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Badge className={getStatusColor(intern.status)}>
                      {intern.status.charAt(0).toUpperCase() + intern.status.slice(1)}
                    </Badge>
                    {intern.rating && (
                      <motion.div 
                        className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 rounded-full px-2 py-1"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-700">{intern.rating}</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>

              <Separator className="mb-6" />

              {/* Information Grid */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {/* Contact Information */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Information
                  </h3>
                  <div className="space-y-2 ml-6">
                    <motion.div 
                      className="flex items-center gap-2 text-sm"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      <span className="truncate">{intern.email}</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-2 text-sm"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <span>{intern.phone}</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-2 text-sm"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span>{intern.location}</span>
                    </motion.div>
                  </div>
                </div>

                <Separator />

                {/* Academic Information */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Academic Information
                  </h3>
                  <div className="space-y-2 ml-6">
                    <motion.div 
                      className="flex items-center gap-2 text-sm"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <BookOpen className="w-3 h-3 text-muted-foreground" />
                      <span>{intern.university}</span>
                    </motion.div>
                  </div>
                </div>

                <Separator />

                {/* Work Information */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Work Information
                  </h3>
                  <div className="space-y-2 ml-6">
                    <motion.div 
                      className="flex items-center gap-2 text-sm"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Building2 className="w-3 h-3 text-muted-foreground" />
                      <span>{intern.department}</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-2 text-sm"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span>Mentor: {intern.mentor}</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-2 text-sm"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span>Started: {formatStartDate(intern.startDate)}</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center gap-2 text-sm"
                      whileHover={{ x: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span>Duration: {calculateDuration(intern.startDate)}</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}