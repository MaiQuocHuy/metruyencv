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
import { useLoginMutation } from '@/services/apiAuth';

const AuthPage = () => {
  const navigate = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/login';
  const defaultTab = isLoginPage ? 'login' : 'register';
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const result = await login({
        usr_email: formData.email,
        usr_password: formData.password
      }).unwrap();

      if (result.status && result.statusCode == 200) {
        const { metadata } = result;
        toast.success('Login successfully!');

        // Set navigating state to true before navigation
        setIsNavigating(true);

        // Wrap navigation in a Promise to handle loading state
        await new Promise<void>((resolve) => {
          if (metadata.user.usr_id === 1) {
            navigate.push('/dashboard/manga');
          } else {
            navigate.push('/');
          }
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
        toast.error('Login failed. Please try again.');
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
      setIsNavigating(false);
    }
  };

  // Determine if we should show loading state
  const showLoading = isLoading || isNavigating;

  return (
    <div className="container mx-auto max-w-md px-4 py-12">
      <div className="bg-card border-border rounded-xl border p-6 shadow-lg">
        {/* Add loading overlay */}
        {showLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-black/50">
            <div className="border-manga-500 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
          </div>
        )}

        <h1 className="manga-heading mb-6 text-center">
          {isLoginPage ? 'Welcome Back!' : 'Join MangaSphere'}
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

          {/* Login Tab */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    id="email"
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
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button
                    type="button"
                    variant="link"
                    className="text-manga-400 h-auto p-0"
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                  <Input
                    id="password"
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

              <Button
                type="submit"
                className="bg-manga-600 hover:bg-manga-700 w-full"
                disabled={showLoading}
              >
                {showLoading ? 'Please wait...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthPage;
