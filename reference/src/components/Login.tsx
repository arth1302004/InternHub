import React, { useState } from 'react';
import { Eye, EyeOff, Users, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from './AuthContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LoginProps {
  onSwitchToSignup: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (!success) {
        // Check if this is an intern account pending approval
        const storedInterns = JSON.parse(localStorage.getItem('intern_management_interns') || '[]');
        const pendingIntern = storedInterns.find((i: any) => i.email === email && i.password === password && i.status !== 'active');
        
        if (pendingIntern) {
          setError('Your account is pending approval. Please wait for HR/Admin to approve your application before logging in.');
        } else {
          setError('Invalid credentials. Please check your email and password.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminQuickLogin = () => {
    setEmail('admin');
    setPassword('admin@123');
  };

  const handleHRQuickLogin = () => {
    setEmail('hr');
    setPassword('hr@123');
  };

  const handleInternQuickLogin = () => {
    setEmail('intern');
    setPassword('intern@123');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex w-1/2 relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1692133226337-55e513450a32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBsb2dpbiUyMG9mZmljZSUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NTY4ODAxOTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Professional workspace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5" />
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-3xl font-semibold mb-2">Welcome to InternHub</h2>
          <p className="text-lg opacity-90">Streamline your internship management experience</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-semibold">InternHub</h1>
            </div>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                Login
              </CardTitle>
              <CardDescription>
                Enter your credentials to access the system
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email / Username</Label>
                  <Input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email or username"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
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

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* Quick Access */}
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Quick Access:</p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAdminQuickLogin}
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    Admin Login (admin / admin@123)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleHRQuickLogin}
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    HR Login (hr / hr@123)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleInternQuickLogin}
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    Intern Login (intern / intern@123)
                  </Button>
                </div>
              </div>

              {/* Signup Link */}
              <div className="mt-6 pt-4 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  New intern?{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={onSwitchToSignup}
                    disabled={isSubmitting}
                  >
                    Create an account
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