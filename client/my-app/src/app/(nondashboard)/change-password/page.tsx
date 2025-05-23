'use client';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useChangePasswordMutation } from '@/services/apiUser';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(7, {
      message: 'Current password must be at least 7 characters.'
    }),
    newPassword: z.string().min(7, {
      message: 'New password must be at least 7 characters.'
    }),
    confirmPassword: z.string().min(7, {
      message: 'Confirm password must be at least 7 characters.'
    })
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [changePassword] = useChangePasswordMutation(); // Assuming you have a mutation for changing password
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    try {
      // Here you would connect to your authentication system to change the password
      console.log('Password change values:', values);

      // Simulate API call
      const response = await changePassword({
        oldPassWord: values.currentPassword,
        newPassword: values.newPassword
      }).unwrap();

      toast('Password changed successfully', {
        description: 'Your password has been updated'
      });

      form.reset();
    } catch (error) {
      toast('Failed to change password', {
        description: 'Please try again later'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  return (
    <div className="container mx-auto max-w-md py-12">
      <Card className="border-manga-400/20 shadow-manga-500/10 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="mb-2 flex items-center justify-center">
            <div className="bg-manga-500/10 flex h-12 w-12 items-center justify-center rounded-full">
              <ShieldCheck className="text-manga-500 h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            Change Password
          </CardTitle>
          <CardDescription className="text-center">
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="Enter your current password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="pr-10"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 h-10 w-10 px-0"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="text-muted-foreground h-4 w-4" />
                        ) : (
                          <Eye className="text-muted-foreground h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showCurrentPassword
                            ? 'Hide password'
                            : 'Show password'}
                        </span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="Enter your new password"
                          type={showNewPassword ? 'text' : 'password'}
                          className="pr-10"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 h-10 w-10 px-0"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showNewPassword ? (
                          <EyeOff className="text-muted-foreground h-4 w-4" />
                        ) : (
                          <Eye className="text-muted-foreground h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showNewPassword ? 'Hide password' : 'Show password'}
                        </span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="Confirm your new password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="pr-10"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 h-10 w-10 px-0"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="text-muted-foreground h-4 w-4" />
                        ) : (
                          <Eye className="text-muted-foreground h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showConfirmPassword
                            ? 'Hide password'
                            : 'Show password'}
                        </span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-manga-500/5 mt-4 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Lock className="text-manga-500 mt-0.5 h-5 w-5" />
                  <div className="text-sm">
                    <p className="text-foreground font-medium">
                      Password requirements:
                    </p>
                    <ul className="text-muted-foreground mt-1 list-inside list-disc space-y-1 text-xs">
                      <li>At least 8 characters long</li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button
            className="bg-manga-500 hover:bg-manga-600 w-full"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Changing Password...
              </div>
            ) : (
              'Change Password'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChangePassword;
