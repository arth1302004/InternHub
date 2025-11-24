import React, { useState } from 'react';
import { Eye, EyeOff, Users, UserPlus, Calendar, GraduationCap, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Textarea } from './ui/textarea';
import { useAuth } from './AuthContext';
import { useApplicationWorkflow } from './ApplicationWorkflow';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SignupProps {
  onSwitchToLogin: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    major: '',
    graduationDate: '',
    skills: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signup } = useAuth();
  const { createApplication } = useApplicationWorkflow();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Full name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Please enter a valid email';
    if (!formData.phone.trim()) return 'Phone number is required';
    if (!formData.university.trim()) return 'University/College is required';
    if (!formData.major.trim()) return 'Major/Field of study is required';
    if (!formData.graduationDate) return 'Expected graduation date is required';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 6) return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      
      // Create application in workflow system with password stored for later
      const applicationId = createApplication({
        candidateName: formData.name,
        email: formData.email,
        phone: formData.phone,
        university: formData.university,
        major: formData.major,
        graduationDate: formData.graduationDate + '-01', // Convert to full date
        skills: skillsArray,
        position: 'General Internship', // Default position
        priority: 'normal',
        source: 'website',
        // Store the password for later account creation after approval
        metadata: {
          originalPassword: formData.password
        }
      });

      // Note: We don't create the actual intern account yet - that happens after approval
      // The old signup function created an intern account immediately, but now we use the workflow
      
      if (applicationId) {
        setSuccess(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          university: '',
          major: '',
          graduationDate: '',
          skills: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        setError('An error occurred during application submission. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-600">Application Submitted!</CardTitle>
            <CardDescription>
              Your internship application has been submitted successfully. Our HR team will review your application and contact you within 5-7 business days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onSwitchToLogin} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex w-1/2 relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1591655630844-28e59efe0c7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGdyYWR1YXRpb24lMjB1bml2ZXJzaXR5fGVufDF8fHx8MTc1Njc5OTIwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Students and graduation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5" />
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-3xl font-semibold mb-2">Start Your Journey</h2>
          <p className="text-lg opacity-90">Join InternHub and kickstart your career</p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-semibold">InternHub</h1>
            </div>
            <p className="text-muted-foreground">Create your intern account</p>
          </div>

          {/* Signup Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Sign Up as Intern
              </CardTitle>
              <CardDescription>
                Fill in your details to create your account
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        className="pl-10"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="pl-10"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="university">University/College *</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="university"
                        type="text"
                        value={formData.university}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                        placeholder="Your university or college"
                        className="pl-10"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="major">Major/Field of Study *</Label>
                    <Input
                      id="major"
                      type="text"
                      value={formData.major}
                      onChange={(e) => handleInputChange('major', e.target.value)}
                      placeholder="e.g., Computer Science, Marketing, etc."
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="graduationDate">Expected Graduation Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="graduationDate"
                        type="month"
                        value={formData.graduationDate}
                        onChange={(e) => handleInputChange('graduationDate', e.target.value)}
                        className="pl-10"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills & Interests</Label>
                    <Textarea
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      placeholder="Enter your skills separated by commas (e.g., JavaScript, Python, Marketing, Design)"
                      rows={3}
                      disabled={isSubmitting}
                    />
                    <p className="text-xs text-muted-foreground">Separate multiple skills with commas</p>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Create a strong password"
                        required
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Confirm your password"
                        required
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              {/* Login Link */}
              <div className="mt-6 pt-4 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={onSwitchToLogin}
                    disabled={isSubmitting}
                  >
                    Sign in
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};