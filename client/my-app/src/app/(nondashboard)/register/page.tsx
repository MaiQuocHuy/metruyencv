'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Lock, Facebook, Twitter, Github } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAppDispatch } from '@/lib/redux/hook';
import { useRegisterMutation } from '@/services/apiAuth';
import { loginSuccess } from '@/lib/redux/slices/authSlice';

const AuthPage = () => {
  const navigate = useRouter();
  const pathname = usePathname();
  const [register, { isLoading }] = useRegisterMutation();
  const [isNavigating, setIsNavigating] = useState(false);
  const isRegisterPage = pathname === '/register';
  const defaultTab = isRegisterPage ? 'register' : 'login';
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  });

  // Determine if we should show loading state
  const showLoading = isLoading || isNavigating;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form fields
    if (!formData.username || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (formData.password.length < 7) {
      toast.error('Password must be at least 7 characters long');
      return;
    }
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const result = await register({
        usr_name: formData.username,
        usr_email: formData.email,
        usr_password: formData.password
      }).unwrap();

      // Check if registration was successful
      if (result.status && result.statusCode == 201) {
        // Extract token and user data from the response
        const { metadata } = result;

        // Dispatch login success action with the token and user data
        dispatch(
          loginSuccess({
            tokens: {
              access_token: metadata.tokens.access_token,
              refresh_token: metadata.tokens.refresh_token
            },
            user: {
              id: metadata.user.usr_id.toString(),
              name: metadata.user.usr_name,
              email: metadata.user.usr_email
            }
          })
        );

        toast.success('Account created successfully!');

        // Set navigating state to true before navigation
        setIsNavigating(true);

        // Wrap navigation in a Promise to handle loading state
        await new Promise<void>((resolve) => {
          navigate.push('/');
          // Add an event listener to detect when navigation is complete
          const checkNavigation = () => {
            if (document.readyState === 'complete') {
              resolve();
            } else {
              window.requestAnimationFrame(checkNavigation);
            }
          };
          checkNavigation();
        });
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setIsNavigating(false);
    }
  };
  return (
    <div className="container mx-auto max-w-md px-4 py-12">
      <div className="bg-card border-border relative rounded-xl border p-6 shadow-lg">
        {/* Add loading overlay */}
        {showLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-black/50">
            <div className="border-manga-500 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
          </div>
        )}

        <h1 className="manga-heading mb-6 text-center">
          {isRegisterPage ? 'Welcome Back!' : 'Join MangaSphere'}
        </h1>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="mb-6 grid grid-cols-2">
            <TabsTrigger value="login" onClick={() => navigate.push('/login')}>
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="register"
              onClick={() => navigate.push('/register')}
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Register Tab */}
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="yourusername"
                    className="pl-10"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="bg-manga-600 hover:bg-manga-700 w-full"
                disabled={showLoading}
              >
                {showLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
